import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { applications } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import {
  RESPONDED_STATUSES,
  SUBMITTED_EXCLUDED,
} from "../../common/utils/applicationStatus.js";
import type { CreatePlatformBody, UpdatePlatformBody } from "./dto/platforms.dto.js";
import { DEFAULT_PLATFORMS, platforms, type Platform } from "./platforms.models.js";

async function ensureSeeded(ownerId: string) {
  const existing = await db
    .select({ id: platforms.id })
    .from(platforms)
    .where(eq(platforms.ownerId, ownerId))
    .limit(1);
  if (existing.length) return;
  await db
    .insert(platforms)
    .values(DEFAULT_PLATFORMS.map((name) => ({ ownerId, name, isSystem: true })));
}

export async function listPlatforms(ownerId: string) {
  await ensureSeeded(ownerId);

  const rows = await db
    .select({
      platform: platforms,
      total: sql<number>`count(${applications.id})`,
      submitted: sql<number>`count(${applications.id}) filter (
        where ${applications.status} <> 'saved'
      )`,
      responded: sql<number>`count(${applications.id}) filter (
        where ${applications.status} in ('interview','offer_received','accepted','rejected')
      )`,
    })
    .from(platforms)
    .leftJoin(
      applications,
      and(eq(applications.platformId, platforms.id), eq(applications.ownerId, ownerId)),
    )
    .where(eq(platforms.ownerId, ownerId))
    .groupBy(platforms.id)
    .orderBy(asc(platforms.name));

  return rows.map((r) => {
    const submitted = Number(r.submitted);
    const responded = Number(r.responded);
    return {
      ...r.platform,
      applicationCount: Number(r.total),
      submittedCount: submitted,
      respondedCount: responded,
      responseRate: submitted > 0 ? Number((responded / submitted).toFixed(4)) : 0,
    };
  });
}

export async function createPlatform(
  ownerId: string,
  body: CreatePlatformBody,
): Promise<Platform> {
  const [row] = await db
    .insert(platforms)
    .values({ ownerId, name: body.name, isSystem: false })
    .returning();
  return row;
}

async function loadOwned(ownerId: string, id: string): Promise<Platform> {
  const [row] = await db
    .select()
    .from(platforms)
    .where(and(eq(platforms.id, id), eq(platforms.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Platform not found");
  return row;
}

export async function updatePlatform(
  ownerId: string,
  id: string,
  body: UpdatePlatformBody,
): Promise<Platform> {
  await loadOwned(ownerId, id);
  const [row] = await db
    .update(platforms)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(platforms.id, id), eq(platforms.ownerId, ownerId)))
    .returning();
  return row;
}

export async function deletePlatform(ownerId: string, id: string): Promise<void> {
  await loadOwned(ownerId, id);
  // applications.platformId is ON DELETE SET NULL, so applications are preserved.
  await db.delete(platforms).where(and(eq(platforms.id, id), eq(platforms.ownerId, ownerId)));
}