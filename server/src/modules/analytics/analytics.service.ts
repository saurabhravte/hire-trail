import { and, count, eq, gte, lt, lte, type SQL, sql } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { applications, interviews, tasks } from "../../common/db/schema.js";
import {
  REACHED_INTERVIEW,
  REACHED_OFFER,
} from "../../common/utils/applicationStatus.js";
import { getCurrentWeekProgress } from "../goals/goals.service.js";
import type { ActivityQuery, AnalyticsRangeQuery } from "./dto/analytics.dto.js";

const num = (v: unknown) => (v == null ? 0 : Number(v));
const rate = (n: number, d: number) => (d > 0 ? Number((n / d).toFixed(4)) : 0);

/** Quoted, parameterized status list for raw IN clauses. */
function statusList(statuses: readonly string[]): SQL {
  return sql.join(
    statuses.map((s) => sql`${s}`),
    sql`, `,
  );
}

const reachedInterviewSql = sql`(a.status::text in (${statusList(REACHED_INTERVIEW)}) or exists (
  select 1 from application_status_history h
  where h.application_id = a.id and h.new_status::text in (${statusList(REACHED_INTERVIEW)})
))`;

const reachedOfferSql = sql`(a.status::text in (${statusList(REACHED_OFFER)}) or exists (
  select 1 from application_status_history h
  where h.application_id = a.id and h.new_status::text in (${statusList(REACHED_OFFER)})
))`;

const respondedSql = sql`(a.status::text = 'rejected' or ${reachedInterviewSql})`;

function appliedRange(from?: string, to?: string): SQL {
  const parts: SQL[] = [];
  if (from) parts.push(sql`a.applied_date >= ${from}`);
  if (to) parts.push(sql`a.applied_date <= ${to}`);
  return parts.length ? sql` and ${sql.join(parts, sql` and `)}` : sql``;
}

function builderRange(from?: string, to?: string): SQL | undefined {
  const parts: (SQL | undefined)[] = [];
  if (from) parts.push(gte(applications.appliedDate, from));
  if (to) parts.push(lte(applications.appliedDate, to));
  return parts.length ? and(...parts) : undefined;
}

/* ----------------------------- Overview -------------------------- */

export async function getOverview(ownerId: string, q: AnalyticsRangeQuery) {
  const range = appliedRange(q.from, q.to);

  const result = await db.execute(sql`
    select
      count(*) filter (where a.status::text <> 'saved') as submitted,
      count(*) filter (where a.status::text in ('applied','interview','offer_received')) as active,
      count(*) filter (where ${reachedOfferSql}) as offers_received,
      count(*) filter (where a.status::text = 'accepted') as offers_accepted,
      count(*) filter (where a.status::text = 'rejected') as rejections,
      count(*) filter (where a.status::text = 'ghosted') as ghosted,
      count(*) filter (where a.status::text = 'withdrawn') as withdrawn,
      count(*) filter (where a.status::text = 'saved') as saved,
      count(*) filter (where a.status::text <> 'saved' and ${reachedInterviewSql}) as reached_interview
    from applications a
    where a.owner_id = ${ownerId} and a.is_archived = false ${range}
  `);
  const row = (result as unknown as Record<string, unknown>[])[0] ?? {};

  const distRows = await db
    .select({ status: applications.status, c: count() })
    .from(applications)
    .where(
      and(
        eq(applications.ownerId, ownerId),
        eq(applications.isArchived, false),
        builderRange(q.from, q.to),
      ),
    )
    .groupBy(applications.status);

  const now = new Date();

  const [{ c: upcomingInterviewsCount }] = await db
    .select({ c: count() })
    .from(interviews)
    .where(
      and(
        eq(interviews.ownerId, ownerId),
        gte(interviews.startTime, now),
        sql`${interviews.status}::text <> 'cancelled'`,
      ),
    );

  const upcomingInterviews = await db
    .select()
    .from(interviews)
    .where(
      and(
        eq(interviews.ownerId, ownerId),
        gte(interviews.startTime, now),
        sql`${interviews.status}::text <> 'cancelled'`,
      ),
    )
    .orderBy(interviews.startTime)
    .limit(5);

  const [{ c: pendingTasks }] = await db
    .select({ c: count() })
    .from(tasks)
    .where(and(eq(tasks.ownerId, ownerId), eq(tasks.state, "pending")));

  const [{ c: overdueTasks }] = await db
    .select({ c: count() })
    .from(tasks)
    .where(
      and(eq(tasks.ownerId, ownerId), eq(tasks.state, "pending"), lt(tasks.dueTime, now)),
    );

  const weeklyGoal = await getCurrentWeekProgress(ownerId);

  const submitted = num(row.submitted);
  return {
    totals: {
      submitted,
      active: num(row.active),
      offersReceived: num(row.offers_received),
      offersAccepted: num(row.offers_accepted),
      rejections: num(row.rejections),
      ghosted: num(row.ghosted),
      withdrawn: num(row.withdrawn),
      saved: num(row.saved),
    },
    funnel: {
      applied: submitted,
      interview: num(row.reached_interview),
      offer: num(row.offers_received),
      accepted: num(row.offers_accepted),
    },
    statusDistribution: distRows.map((d) => ({ status: d.status, count: Number(d.c) })),
    upcomingInterviewsCount: Number(upcomingInterviewsCount),
    upcomingInterviews,
    pendingTasksCount: Number(pendingTasks),
    overdueTasksCount: Number(overdueTasks),
    weeklyGoal,
  };
}

/* ---------------------------- Conversion ------------------------- */

export async function getConversion(ownerId: string, q: AnalyticsRangeQuery) {
  const range = appliedRange(q.from, q.to);

  const result = await db.execute(sql`
    select
      count(*) filter (where a.status::text <> 'saved') as submitted,
      count(*) filter (where a.status::text <> 'saved' and ${respondedSql}) as responded,
      count(*) filter (where a.status::text <> 'saved' and ${reachedInterviewSql}) as reached_interview,
      count(*) filter (where ${reachedOfferSql}) as reached_offer,
      count(*) filter (where a.status::text = 'accepted') as accepted
    from applications a
    where a.owner_id = ${ownerId} and a.is_archived = false ${range}
  `);
  const row = (result as unknown as Record<string, unknown>[])[0] ?? {};

  // Average days to first response (interview / offer / accepted / rejected).
  const firstResponse = await db.execute(sql`
    select
      avg(extract(epoch from (fr.first_response - a.applied_date::timestamptz)) / 86400) as avg_days,
      count(*) as sample
    from applications a
    join lateral (
      select min(h.changed_at) as first_response
      from application_status_history h
      where h.application_id = a.id
        and h.new_status::text in ('interview','offer_received','accepted','rejected')
    ) fr on true
    where a.owner_id = ${ownerId} and a.status::text <> 'saved'
      and a.applied_date is not null and fr.first_response is not null ${range}
  `);
  const fr = (firstResponse as unknown as Record<string, unknown>[])[0] ?? {};

  const firstInterview = await db.execute(sql`
    select
      avg(extract(epoch from (fi.first_interview - a.applied_date::timestamptz)) / 86400) as avg_days,
      count(*) as sample
    from applications a
    join lateral (
      select min(h.changed_at) as first_interview
      from application_status_history h
      where h.application_id = a.id
        and h.new_status::text in ('interview','offer_received','accepted')
    ) fi on true
    where a.owner_id = ${ownerId} and a.status::text <> 'saved'
      and a.applied_date is not null and fi.first_interview is not null ${range}
  `);
  const fi = (firstInterview as unknown as Record<string, unknown>[])[0] ?? {};

  const submitted = num(row.submitted);
  const reachedOffer = num(row.reached_offer);
  return {
    submitted,
    responded: num(row.responded),
    responseRate: rate(num(row.responded), submitted),
    reachedInterview: num(row.reached_interview),
    interviewConversion: rate(num(row.reached_interview), submitted),
    offersReceived: reachedOffer,
    offerRate: rate(reachedOffer, submitted),
    offersAccepted: num(row.accepted),
    acceptanceRate: rate(num(row.accepted), reachedOffer),
    avgDaysToFirstResponse: {
      value: fr.avg_days == null ? null : Number(Number(fr.avg_days).toFixed(1)),
      sampleSize: num(fr.sample),
    },
    avgDaysToInterview: {
      value: fi.avg_days == null ? null : Number(Number(fi.avg_days).toFixed(1)),
      sampleSize: num(fi.sample),
    },
  };
}

/* ---------------------------- Breakdowns ------------------------- */

type BreakdownRow = { label: string | null; submitted: unknown; responded: unknown };

function mapBreakdown(rows: BreakdownRow[]) {
  return rows.map((r) => {
    const submitted = num(r.submitted);
    const responded = num(r.responded);
    return {
      label: r.label ?? "Unspecified",
      submitted,
      responded,
      responseRate: rate(responded, submitted),
    };
  });
}

export async function getBreakdowns(ownerId: string, q: AnalyticsRangeQuery) {
  const range = appliedRange(q.from, q.to);

  const byPlatform = await db.execute(sql`
    select p.name as label,
      count(*) filter (where a.status::text <> 'saved') as submitted,
      count(*) filter (where a.status::text <> 'saved' and ${respondedSql}) as responded
    from applications a
    left join platforms p on p.id = a.platform_id and p.owner_id = ${ownerId}
    where a.owner_id = ${ownerId} and a.is_archived = false ${range}
    group by p.name order by submitted desc
  `);

  const byResume = await db.execute(sql`
    select r.label as label,
      count(*) filter (where a.status::text <> 'saved') as submitted,
      count(*) filter (where a.status::text <> 'saved' and ${respondedSql}) as responded
    from applications a
    left join resume_versions r on r.id = a.resume_version_id and r.owner_id = ${ownerId}
    where a.owner_id = ${ownerId} and a.is_archived = false ${range}
    group by r.label order by submitted desc
  `);

  const byRole = await db.execute(sql`
    select a.role as label,
      count(*) filter (where a.status::text <> 'saved') as submitted,
      count(*) filter (where a.status::text <> 'saved' and ${respondedSql}) as responded
    from applications a
    where a.owner_id = ${ownerId} and a.is_archived = false ${range}
    group by a.role order by submitted desc limit 25
  `);

  const byTech = await db.execute(sql`
    select tech as label,
      count(*) filter (where a.status::text <> 'saved') as submitted,
      count(*) filter (where a.status::text <> 'saved' and ${respondedSql}) as responded
    from applications a
    cross join lateral unnest(a.tech_stack) as tech
    where a.owner_id = ${ownerId} and a.is_archived = false ${range}
    group by tech order by submitted desc limit 25
  `);

  return {
    byPlatform: mapBreakdown(byPlatform as unknown as BreakdownRow[]),
    byResume: mapBreakdown(byResume as unknown as BreakdownRow[]),
    byRole: mapBreakdown(byRole as unknown as BreakdownRow[]),
    byTechStack: mapBreakdown(byTech as unknown as BreakdownRow[]),
  };
}

/* ------------------------- Activity graph ------------------------ */

export async function getActivity(ownerId: string, q: ActivityQuery) {
  const range = appliedRange(q.from, q.to);
  const rows = await db.execute(sql`
    select to_char(date_trunc(${q.groupBy}, a.applied_date), 'YYYY-MM-DD') as bucket,
           count(*) as c
    from applications a
    where a.owner_id = ${ownerId} and a.status::text <> 'saved'
      and a.applied_date is not null ${range}
    group by 1 order by 1
  `);
  return (rows as unknown as Record<string, unknown>[]).map((r) => ({
    bucket: String(r.bucket),
    count: num(r.c),
  }));
}