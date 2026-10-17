import {
  and,
  arrayOverlaps,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { companies } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { buildPageMeta } from "../../common/utils/apiResponse.js";
import { findOrCreateCompany } from "../companies/companies.service.js";
import {
  ACTIVITY_EVENTS,
  applicationActivity,
  applications,
  applicationStatusHistory,
  type Application,
} from "./applications.models.js";
import type {
  BulkActionBody,
  CreateApplicationBody,
  DuplicateCheckQuery,
  ListApplicationsQuery,
  StatusChangeBody,
  UpdateApplicationBody,
} from "./dto/applications.dto.js";

const SORT_COLUMNS = {
  company: companies.name,
  role: applications.role,
  appliedDate: applications.appliedDate,
  salary: applications.salaryMax,
  status: applications.status,
  updatedAt: applications.updatedAt,
  priority: applications.priority,
} as const;

/** Numeric columns come back as strings from pg; expose them as numbers. */
function serialize(row: Application & { company?: unknown }) {
  return {
    ...row,
    salaryMin: row.salaryMin == null ? null : Number(row.salaryMin),
    salaryMax: row.salaryMax == null ? null : Number(row.salaryMax),
  };
}

function resolveCompanyName(companyNorm: string) {
  return companyNorm.trim().toLowerCase().replace(/\s+/g, " ");
}

/* ------------------------------- List ---------------------------- */

export async function listApplications(ownerId: string, query: ListApplicationsQuery) {
  const {
    page,
    pageSize,
    q,
    status,
    workMode,
    priority,
    platformId,
    techStack,
    location,
    companyId,
    appliedFrom,
    appliedTo,
    archived,
    sort,
    dir,
  } = query;

  const conds = [eq(applications.ownerId, ownerId)];

  if (archived === "true") conds.push(eq(applications.isArchived, true));
  else if (archived === "false") conds.push(eq(applications.isArchived, false));
  // "all" => no archive filter

  if (q) {
    const like = `%${q}%`;
    conds.push(
      or(
        ilike(applications.role, like),
        ilike(applications.notes, like),
        ilike(applications.location, like),
        ilike(applications.jobId, like),
        ilike(companies.name, like),
      )!,
    );
  }
  if (status?.length) conds.push(inArray(applications.status, status));
  if (workMode?.length) conds.push(inArray(applications.workMode, workMode));
  if (priority?.length) conds.push(inArray(applications.priority, priority));
  if (platformId?.length) conds.push(inArray(applications.platformId, platformId));
  if (techStack?.length) conds.push(arrayOverlaps(applications.techStack, techStack));
  if (location) conds.push(ilike(applications.location, `%${location}%`));
  if (companyId) conds.push(eq(applications.companyId, companyId));
  if (appliedFrom) conds.push(gte(applications.appliedDate, appliedFrom));
  if (appliedTo) conds.push(lte(applications.appliedDate, appliedTo));

  const where = and(...conds);

  const [{ total }] = await db
    .select({ total: count() })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(where);

  const sortCol = SORT_COLUMNS[sort];
  const primary = sql`${sortCol} ${sql.raw(dir === "asc" ? "asc" : "desc")} nulls last`;

  const rows = await db
    .select({
      application: applications,
      companyName: companies.name,
    })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(where)
    .orderBy(primary, asc(applications.id)) // deterministic tie-break (PRD §8)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const data = rows.map((r) => ({ ...serialize(r.application), companyName: r.companyName }));
  return { data, meta: buildPageMeta(Number(total), page, pageSize) };
}

/* ------------------------------ Grouped -------------------------- */

export async function listGroupedByCompany(ownerId: string, includeArchived: boolean) {
  const rows = await db
    .select({ application: applications, companyName: companies.name })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(
      and(
        eq(applications.ownerId, ownerId),
        includeArchived ? undefined : eq(applications.isArchived, false),
      ),
    )
    .orderBy(asc(companies.name), desc(applications.updatedAt));

  const groups = new Map<
    string,
    { companyId: string | null; companyName: string; applications: unknown[] }
  >();

  for (const r of rows) {
    const key = r.application.companyId ?? "__none__";
    if (!groups.has(key)) {
      groups.set(key, {
        companyId: r.application.companyId,
        companyName: r.companyName ?? "No company",
        applications: [],
      });
    }
    groups.get(key)!.applications.push({ ...serialize(r.application), companyName: r.companyName });
  }

  return [...groups.values()].map((g) => ({ ...g, count: g.applications.length }));
}

/* ------------------------------- Read ---------------------------- */

export async function getApplicationById(ownerId: string, id: string) {
  const [row] = await db
    .select({ application: applications, companyName: companies.name })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(and(eq(applications.id, id), eq(applications.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Application not found");
  return { ...serialize(row.application), companyName: row.companyName };
}

/** Internal: load owned row or throw. */
async function loadOwned(ownerId: string, id: string): Promise<Application> {
  const [row] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.id, id), eq(applications.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Application not found");
  return row;
}

/* ------------------------------ Create --------------------------- */

export async function createApplication(ownerId: string, body: CreateApplicationBody) {
  return db.transaction(async (tx) => {
    let companyId = body.companyId ?? null;
    if (!companyId && body.companyName) {
      const company = await findOrCreateCompany(ownerId, body.companyName);
      companyId = company.id;
    }

    const [created] = await tx
      .insert(applications)
      .values({
        ownerId,
        companyId,
        role: body.role,
        status: body.status,
        appliedDate: body.appliedDate ?? null,
        salaryMin: body.salaryMin == null ? null : String(body.salaryMin),
        salaryMax: body.salaryMax == null ? null : String(body.salaryMax),
        currency: body.currency ?? null,
        payPeriod: body.payPeriod ?? null,
        location: body.location ?? null,
        workMode: body.workMode ?? null,
        techStack: body.techStack ?? [],
        platformId: body.platformId ?? null,
        resumeVersionId: body.resumeVersionId ?? null,
        jobUrl: body.jobUrl ?? null,
        jobId: body.jobId ?? null,
        priority: body.priority,
        recruiterName: body.recruiterName ?? null,
        recruiterEmail: body.recruiterEmail ?? null,
        recruiterPhone: body.recruiterPhone ?? null,
        referralPerson: body.referralPerson ?? null,
        referralNotes: body.referralNotes ?? null,
        notes: body.notes ?? null,
      })
      .returning();

    await tx.insert(applicationStatusHistory).values({
      applicationId: created.id,
      ownerId,
      previousStatus: null,
      newStatus: created.status,
    });

    await tx.insert(applicationActivity).values({
      applicationId: created.id,
      ownerId,
      eventType: ACTIVITY_EVENTS.CREATED,
      metadata: { status: created.status },
    });

    return serialize(created);
  });
}

/* ------------------------------ Update --------------------------- */

const MONEY_KEYS = ["salaryMin", "salaryMax"] as const;

export async function updateApplication(
  ownerId: string,
  id: string,
  body: UpdateApplicationBody,
) {
  const existing = await loadOwned(ownerId, id);

  return db.transaction(async (tx) => {
    let companyId = existing.companyId;
    if (body.companyId !== undefined) companyId = body.companyId;
    else if (body.companyName) {
      const company = await findOrCreateCompany(ownerId, body.companyName);
      companyId = company.id;
    }

    const { companyName: _cn, statusNote, status, ...rest } = body;
    const patch: Record<string, unknown> = { ...rest, companyId, updatedAt: new Date() };

    // numeric columns want strings
    for (const key of MONEY_KEYS) {
      if (key in patch) {
        const v = patch[key] as number | null | undefined;
        patch[key] = v == null ? null : String(v);
      }
    }
    if (status !== undefined) patch.status = status;

    const [updated] = await tx
      .update(applications)
      .set(patch)
      .where(and(eq(applications.id, id), eq(applications.ownerId, ownerId)))
      .returning();

    // Status change => history + activity (PRD §7, §13)
    if (status !== undefined && status !== existing.status) {
      await tx.insert(applicationStatusHistory).values({
        applicationId: id,
        ownerId,
        previousStatus: existing.status,
        newStatus: status,
        note: statusNote ?? null,
      });
      await tx.insert(applicationActivity).values({
        applicationId: id,
        ownerId,
        eventType: ACTIVITY_EVENTS.STATUS_CHANGED,
        metadata: { from: existing.status, to: status },
      });
    } else {
      await tx.insert(applicationActivity).values({
        applicationId: id,
        ownerId,
        eventType:
          body.notes !== undefined ? ACTIVITY_EVENTS.NOTE_EDITED : ACTIVITY_EVENTS.UPDATED,
        metadata: {},
      });
    }

    return serialize(updated);
  });
}

/** Dedicated status transition (PRD §7). */
export async function changeStatus(ownerId: string, id: string, body: StatusChangeBody) {
  return updateApplication(ownerId, id, { status: body.status, statusNote: body.note });
}

/* -------------------------- Archive / Delete --------------------- */

export async function setArchived(ownerId: string, id: string, archived: boolean) {
  await loadOwned(ownerId, id);
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(applications)
      .set({ isArchived: archived, updatedAt: new Date() })
      .where(and(eq(applications.id, id), eq(applications.ownerId, ownerId)))
      .returning();
    await tx.insert(applicationActivity).values({
      applicationId: id,
      ownerId,
      eventType: archived ? ACTIVITY_EVENTS.ARCHIVED : ACTIVITY_EVENTS.RESTORED,
      metadata: {},
    });
    return serialize(row);
  });
}

export async function deleteApplication(ownerId: string, id: string) {
  await loadOwned(ownerId, id);
  // History/activity/interviews/offers cascade via FK.
  await db.delete(applications).where(and(eq(applications.id, id), eq(applications.ownerId, ownerId)));
}

/* ------------------------------- Bulk ---------------------------- */

export async function bulkAction(ownerId: string, body: BulkActionBody) {
  const where = and(eq(applications.ownerId, ownerId), inArray(applications.id, body.ids));

  if (body.action === "delete") {
    const deleted = await db.delete(applications).where(where).returning({ id: applications.id });
    return { affected: deleted.length };
  }

  const archived = body.action === "archive";
  const updated = await db
    .update(applications)
    .set({ isArchived: archived, updatedAt: new Date() })
    .where(where)
    .returning({ id: applications.id });

  if (updated.length) {
    await db.insert(applicationActivity).values(
      updated.map((u) => ({
        applicationId: u.id,
        ownerId,
        eventType: archived ? ACTIVITY_EVENTS.ARCHIVED : ACTIVITY_EVENTS.RESTORED,
        metadata: { bulk: true },
      })),
    );
  }
  return { affected: updated.length };
}

/* ----------------------- History / Activity ---------------------- */

export async function getStatusHistory(ownerId: string, id: string) {
  await loadOwned(ownerId, id);
  return db
    .select()
    .from(applicationStatusHistory)
    .where(eq(applicationStatusHistory.applicationId, id))
    .orderBy(desc(applicationStatusHistory.changedAt));
}

export async function getActivity(ownerId: string, id: string) {
  await loadOwned(ownerId, id);
  return db
    .select()
    .from(applicationActivity)
    .where(eq(applicationActivity.applicationId, id))
    .orderBy(desc(applicationActivity.createdAt));
}

/* ---------------------- Duplicate detection ---------------------- */

export async function findDuplicates(ownerId: string, query: DuplicateCheckQuery) {
  const ors = [];
  if (query.jobUrl) ors.push(eq(applications.jobUrl, query.jobUrl));
  if (query.companyName && query.role) {
    ors.push(
      and(
        eq(companies.normalizedName, resolveCompanyName(query.companyName)),
        ilike(applications.role, query.role),
      )!,
    );
  }
  if (!ors.length) return [];

  const rows = await db
    .select({ application: applications, companyName: companies.name })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(and(eq(applications.ownerId, ownerId), or(...ors)))
    .limit(10);

  return rows.map((r) => ({ ...serialize(r.application), companyName: r.companyName }));
}