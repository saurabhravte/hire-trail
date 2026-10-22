import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { and, eq, gte, ne, sql } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { applications } from "../../common/db/schema.js";
import { getTimezone } from "../users/users.service.js";

export interface StreakResult {
  current: number;
  longest: number;
  appliedToday: boolean;
  /** Daily apply counts for the heatmap, oldest → newest. */
  heatmap: { date: string; count: number }[];
}

/** Local YYYY-MM-DD for an instant in a timezone. */
function dayKey(d: Date, tz: string): string {
  return format(toZonedTime(d, tz), "yyyy-MM-dd");
}

/** Add n days to a YYYY-MM-DD string (UTC-safe, date-only). */
function addDaysKey(key: string, n: number): string {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * A "streak" counts consecutive days on which the user submitted at least one
 * application (saved jobs never count). The current streak resets the moment a
 * day is missed — so if the user didn't apply today, it still counts if they
 * applied yesterday (today is a grace day), but breaks if yesterday is empty.
 */
export async function getStreak(ownerId: string, windowDays = 182): Promise<StreakResult> {
  const tz = await getTimezone(ownerId);
  const now = new Date();
  const todayKey = dayKey(now, tz);

  // Pull applied-date instants within the window; bucket to local day in JS so
  // the timezone matches the rest of the app (week boundaries, etc.).
  const windowStart = new Date(now.getTime() - windowDays * 86_400_000);
  const rows = await db
    .select({ appliedDate: applications.appliedDate, createdAt: applications.createdAt })
    .from(applications)
    .where(
      and(
        eq(applications.ownerId, ownerId),
        ne(applications.status, "saved"),
        gte(applications.createdAt, windowStart),
      ),
    );

  // Count per local day. Prefer appliedDate; fall back to createdAt.
  const counts = new Map<string, number>();
  for (const r of rows) {
    const key = r.appliedDate ?? dayKey(r.createdAt, tz);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  // Build a dense heatmap array across the window (0-filled).
  const heatmap: { date: string; count: number }[] = [];
  const startKey = dayKey(windowStart, tz);
  for (let key = startKey; key <= todayKey; key = addDaysKey(key, 1)) {
    heatmap.push({ date: key, count: counts.get(key) ?? 0 });
  }

  const has = (key: string) => (counts.get(key) ?? 0) > 0;
  const appliedToday = has(todayKey);

  // Current streak: walk backwards from today; today missing is allowed as a
  // grace day only if yesterday has activity.
  let current = 0;
  let cursor = appliedToday ? todayKey : addDaysKey(todayKey, -1);
  while (has(cursor)) {
    current += 1;
    cursor = addDaysKey(cursor, -1);
  }

  // Longest streak across the window.
  let longest = 0;
  let run = 0;
  for (const cell of heatmap) {
    if (cell.count > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  return { current, longest, appliedToday, heatmap };
}
