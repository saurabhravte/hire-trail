import { endOfWeek, format, startOfWeek } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { and, count, eq, gte, lte, ne } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { applications } from "../../common/db/schema.js";
import { getTimezone } from "../users/users.service.js";
import type { UpsertGoalBody } from "./dto/goals.dto.js";
import { weeklyGoals, type WeeklyGoal } from "./goals.models.js";

/** Current week's [start, end] as YYYY-MM-DD strings in the user's timezone. */
async function currentWeekRange(ownerId: string) {
  const tz = await getTimezone(ownerId);
  const zonedNow = toZonedTime(new Date(), tz);
  const start = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const end = endOfWeek(zonedNow, { weekStartsOn: 1 });
  return { weekStart: format(start, "yyyy-MM-dd"), weekEnd: format(end, "yyyy-MM-dd") };
}

async function countSubmittedInRange(ownerId: string, weekStart: string, weekEnd: string) {
  const [{ c }] = await db
    .select({ c: count() })
    .from(applications)
    .where(
      and(
        eq(applications.ownerId, ownerId),
        ne(applications.status, "saved"), // Saved never counts (PRD §17)
        gte(applications.appliedDate, weekStart),
        lte(applications.appliedDate, weekEnd),
      ),
    );
  return Number(c);
}

export async function getCurrentWeekProgress(ownerId: string) {
  const { weekStart, weekEnd } = await currentWeekRange(ownerId);

  const [goal] = await db
    .select()
    .from(weeklyGoals)
    .where(and(eq(weeklyGoals.ownerId, ownerId), eq(weeklyGoals.weekStart, weekStart)))
    .limit(1);

  const submitted = await countSubmittedInRange(ownerId, weekStart, weekEnd);
  const target = goal?.targetCount ?? 0;

  return {
    weekStart,
    weekEnd,
    targetCount: target,
    submittedCount: submitted,
    remaining: Math.max(0, target - submitted),
    progress: target > 0 ? Math.min(1, Number((submitted / target).toFixed(4))) : 0,
    isPaused: goal?.isPaused ?? false,
    hasGoal: Boolean(goal),
  };
}

export async function upsertCurrentWeekGoal(
  ownerId: string,
  body: UpsertGoalBody,
): Promise<WeeklyGoal> {
  const { weekStart, weekEnd } = await currentWeekRange(ownerId);

  const [existing] = await db
    .select()
    .from(weeklyGoals)
    .where(and(eq(weeklyGoals.ownerId, ownerId), eq(weeklyGoals.weekStart, weekStart)))
    .limit(1);

  if (existing) {
    const [row] = await db
      .update(weeklyGoals)
      .set({
        targetCount: body.targetCount,
        isPaused: body.isPaused ?? existing.isPaused,
        updatedAt: new Date(),
      })
      .where(eq(weeklyGoals.id, existing.id))
      .returning();
    return row;
  }

  const [row] = await db
    .insert(weeklyGoals)
    .values({
      ownerId,
      targetCount: body.targetCount,
      isPaused: body.isPaused ?? false,
      weekStart,
      weekEnd,
    })
    .returning();
  return row;
}