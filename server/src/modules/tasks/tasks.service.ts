import { and, asc, eq, gte, lt } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { applications } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { logApplicationActivity } from "../../common/utils/activity.js";
import * as notificationsService from "../notifications/notifications.service.js";
import type {
  CreateTaskBody,
  ListTasksQuery,
  UpdateTaskBody,
} from "./dto/tasks.dto.js";
import { tasks, type Task } from "./tasks.models.js";

async function assertOwnsApplication(ownerId: string, applicationId: string) {
  const [row] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Application not found");
}

async function loadOwned(ownerId: string, id: string): Promise<Task> {
  const [row] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Task not found");
  return row;
}

async function syncReminder(ownerId: string, task: Task) {
  if (task.state === "completed" || !task.dueTime) {
    await notificationsService.deleteByDedup(ownerId, `task:${task.id}`);
    return;
  }
  await notificationsService.upsertByDedup(ownerId, {
    dedupKey: `task:${task.id}`,
    type: "task_due",
    title: "Follow-up due",
    body: task.title,
    scheduledTime: task.dueTime,
    relatedEntityType: "task",
    relatedEntityId: task.id,
  });
}

export async function listTasks(ownerId: string, query: ListTasksQuery): Promise<Task[]> {
  const now = new Date();
  const conds = [eq(tasks.ownerId, ownerId)];
  if (query.applicationId) conds.push(eq(tasks.applicationId, query.applicationId));
  if (query.state) conds.push(eq(tasks.state, query.state));

  if (query.filter === "upcoming") {
    conds.push(eq(tasks.state, "pending"));
    conds.push(gte(tasks.dueTime, now));
  } else if (query.filter === "overdue") {
    conds.push(eq(tasks.state, "pending"));
    conds.push(lt(tasks.dueTime, now));
  }

  return db
    .select()
    .from(tasks)
    .where(and(...conds))
    .orderBy(asc(tasks.dueTime));
}

export async function createTask(ownerId: string, body: CreateTaskBody): Promise<Task> {
  if (body.applicationId) await assertOwnsApplication(ownerId, body.applicationId);

  const created = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(tasks)
      .values({ ownerId, ...body, applicationId: body.applicationId ?? null })
      .returning();
    if (row.applicationId) {
      await logApplicationActivity(tx, {
        applicationId: row.applicationId,
        ownerId,
        eventType: "task_created",
        metadata: { taskId: row.id, title: row.title },
      });
    }
    return row;
  });

  await syncReminder(ownerId, created);
  return created;
}

export async function updateTask(
  ownerId: string,
  id: string,
  body: UpdateTaskBody,
): Promise<Task> {
  const existing = await loadOwned(ownerId, id);
  if (body.applicationId) await assertOwnsApplication(ownerId, body.applicationId);

  const updated = await db.transaction(async (tx) => {
    const patch: Partial<Task> = { ...body, updatedAt: new Date() };
    const completing = body.state === "completed" && existing.state !== "completed";
    const reopening = body.state === "pending" && existing.state === "completed";
    if (completing) patch.completedAt = new Date();
    if (reopening) patch.completedAt = null;

    const [row] = await tx
      .update(tasks)
      .set(patch)
      .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
      .returning();

    if (completing && row.applicationId) {
      await logApplicationActivity(tx, {
        applicationId: row.applicationId,
        ownerId,
        eventType: "task_completed",
        metadata: { taskId: row.id },
      });
    }
    return row;
  });

  await syncReminder(ownerId, updated);
  return updated;
}

export async function completeTask(ownerId: string, id: string): Promise<Task> {
  return updateTask(ownerId, id, { state: "completed" });
}

export async function deleteTask(ownerId: string, id: string): Promise<void> {
  const existing = await loadOwned(ownerId, id);
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)));
  await notificationsService.deleteByDedup(ownerId, `task:${existing.id}`);
}