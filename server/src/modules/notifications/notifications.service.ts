import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { buildPageMeta } from "../../common/utils/apiResponse.js";
import type {
  ListNotificationsQuery,
  UpdateNotificationBody,
} from "./dto/notifications.dto.js";
import { notifications, type Notification } from "./notifications.models.js";

export async function listNotifications(ownerId: string, query: ListNotificationsQuery) {
  const { page, pageSize, unreadOnly } = query;
  const where = and(
    eq(notifications.ownerId, ownerId),
    unreadOnly === "true" ? isNull(notifications.readAt) : undefined,
  );

  const [{ total }] = await db.select({ total: count() }).from(notifications).where(where);

  const data = await db
    .select()
    .from(notifications)
    .where(where)
    .orderBy(desc(notifications.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, meta: buildPageMeta(Number(total), page, pageSize) };
}

export async function updateNotificationState(
  ownerId: string,
  id: string,
  body: UpdateNotificationBody,
): Promise<Notification> {
  const [existing] = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.id, id), eq(notifications.ownerId, ownerId)))
    .limit(1);
  if (!existing) throw ApiError.notFound("Notification not found");

  const patch: Partial<Notification> = {};
  if (body.read !== undefined) patch.readAt = body.read ? new Date() : null;
  if (body.dismissed !== undefined) patch.dismissedAt = body.dismissed ? new Date() : null;

  const [row] = await db
    .update(notifications)
    .set(patch)
    .where(and(eq(notifications.id, id), eq(notifications.ownerId, ownerId)))
    .returning();
  return row;
}

/**
 * Idempotent reminder creation (PRD §15): keyed by (ownerId, dedupKey).
 * If one already exists, its schedule/title/body are refreshed (handles reschedules).
 */
export async function upsertByDedup(
  ownerId: string,
  data: {
    dedupKey: string;
    type: string;
    title: string;
    body?: string | null;
    scheduledTime?: Date | null;
    relatedEntityType?: string | null;
    relatedEntityId?: string | null;
  },
): Promise<void> {
  const [existing] = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(and(eq(notifications.ownerId, ownerId), eq(notifications.dedupKey, data.dedupKey)))
    .limit(1);

  if (existing) {
    await db
      .update(notifications)
      .set({
        title: data.title,
        body: data.body ?? null,
        scheduledTime: data.scheduledTime ?? null,
      })
      .where(eq(notifications.id, existing.id));
    return;
  }

  await db.insert(notifications).values({
    ownerId,
    dedupKey: data.dedupKey,
    type: data.type,
    title: data.title,
    body: data.body ?? null,
    scheduledTime: data.scheduledTime ?? null,
    relatedEntityType: data.relatedEntityType ?? null,
    relatedEntityId: data.relatedEntityId ?? null,
  });
}

export async function deleteByDedup(ownerId: string, dedupKey: string): Promise<void> {
  await db
    .delete(notifications)
    .where(and(eq(notifications.ownerId, ownerId), eq(notifications.dedupKey, dedupKey)));
}