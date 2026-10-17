import { and, asc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { applications } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { logApplicationActivity } from "../../common/utils/activity.js";
import * as notificationsService from "../notifications/notifications.service.js";
import type {
  CreateInterviewBody,
  ListInterviewsQuery,
  UpdateInterviewBody,
} from "./dto/interviews.dto.js";
import { interviews, type Interview } from "./interviews.models.js";

async function assertOwnsApplication(ownerId: string, applicationId: string) {
  const [row] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Application not found");
}

async function loadOwned(ownerId: string, id: string): Promise<Interview> {
  const [row] = await db
    .select()
    .from(interviews)
    .where(and(eq(interviews.id, id), eq(interviews.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Interview not found");
  return row;
}

async function syncReminder(ownerId: string, interview: Interview) {
  if (interview.status === "cancelled") {
    await notificationsService.deleteByDedup(ownerId, `interview:${interview.id}`);
    return;
  }
  await notificationsService.upsertByDedup(ownerId, {
    dedupKey: `interview:${interview.id}`,
    type: "interview_upcoming",
    title: "Upcoming interview",
    body: `${interview.roundType} round`,
    scheduledTime: interview.startTime,
    relatedEntityType: "interview",
    relatedEntityId: interview.id,
  });
}

export async function listInterviews(ownerId: string, query: ListInterviewsQuery) {
  const conds = [eq(interviews.ownerId, ownerId)];
  if (query.applicationId) conds.push(eq(interviews.applicationId, query.applicationId));
  if (query.status) conds.push(eq(interviews.status, query.status));
  if (query.from) conds.push(gte(interviews.startTime, query.from));
  if (query.to) conds.push(lte(interviews.startTime, query.to));
  if (query.upcoming === "true") conds.push(gte(interviews.startTime, new Date()));

  return db
    .select()
    .from(interviews)
    .where(and(...conds))
    .orderBy(asc(interviews.startTime));
}

export async function createInterview(
  ownerId: string,
  applicationId: string,
  body: CreateInterviewBody,
): Promise<Interview> {
  await assertOwnsApplication(ownerId, applicationId);

  const created = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(interviews)
      .values({ ownerId, applicationId, ...body })
      .returning();
    await logApplicationActivity(tx, {
      applicationId,
      ownerId,
      eventType: "interview_scheduled",
      metadata: { interviewId: row.id, roundType: row.roundType },
    });
    return row;
  });

  await syncReminder(ownerId, created);
  return created;
}

export async function updateInterview(
  ownerId: string,
  id: string,
  body: UpdateInterviewBody,
): Promise<Interview> {
  const existing = await loadOwned(ownerId, id);

  const updated = await db.transaction(async (tx) => {
    const [row] = await tx
      .update(interviews)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(interviews.id, id), eq(interviews.ownerId, ownerId)))
      .returning();

    const rescheduled =
      body.startTime !== undefined && body.startTime.getTime() !== existing.startTime.getTime();
    const cancelled = body.status === "cancelled" && existing.status !== "cancelled";
    const outcomeChanged = body.outcome !== undefined && body.outcome !== existing.outcome;

    if (rescheduled) {
      await logApplicationActivity(tx, {
        applicationId: existing.applicationId,
        ownerId,
        eventType: "interview_rescheduled",
        metadata: { interviewId: id },
      });
    }
    if (cancelled) {
      await logApplicationActivity(tx, {
        applicationId: existing.applicationId,
        ownerId,
        eventType: "interview_cancelled",
        metadata: { interviewId: id },
      });
    }
    if (outcomeChanged) {
      await logApplicationActivity(tx, {
        applicationId: existing.applicationId,
        ownerId,
        eventType: "interview_outcome",
        metadata: { interviewId: id, outcome: body.outcome },
      });
    }
    return row;
  });

  await syncReminder(ownerId, updated);
  return updated;
}

export async function deleteInterview(ownerId: string, id: string): Promise<void> {
  const existing = await loadOwned(ownerId, id);
  await db.delete(interviews).where(and(eq(interviews.id, id), eq(interviews.ownerId, ownerId)));
  await notificationsService.deleteByDedup(ownerId, `interview:${existing.id}`);
}