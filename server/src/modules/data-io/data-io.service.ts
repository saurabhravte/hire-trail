import { and, eq, ilike } from "drizzle-orm";
import Papa from "papaparse";
import { db } from "../../common/db/index.js";
import { companies, platforms } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { normalizeCompanyName } from "../companies/companies.models.js";
import * as applicationsService from "../applications/applications.service.js";
import { applications } from "../applications/applications.models.js";
import { commitImportBody, importRowSchema, type ImportRow } from "./dto/data-io.dto.js";
import { CSV_COLUMNS, importJobs } from "./data-io.models.js";

const MAX_IMPORT_ROWS = 2000;

/* ------------------------------ Export --------------------------- */

/** Neutralize CSV/Excel formula injection on export (PRD §19). */
function sanitizeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return s;
}

export async function exportApplicationsCsv(ownerId: string): Promise<string> {
  const rows = await db
    .select({ application: applications, companyName: companies.name, platformName: platforms.name })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .leftJoin(platforms, eq(applications.platformId, platforms.id))
    .where(eq(applications.ownerId, ownerId));

  const records = rows.map((r) => {
    const a = r.application;
    return {
      company: sanitizeCell(r.companyName),
      role: sanitizeCell(a.role),
      status: sanitizeCell(a.status),
      appliedDate: sanitizeCell(a.appliedDate),
      salaryMin: sanitizeCell(a.salaryMin),
      salaryMax: sanitizeCell(a.salaryMax),
      currency: sanitizeCell(a.currency),
      payPeriod: sanitizeCell(a.payPeriod),
      location: sanitizeCell(a.location),
      workMode: sanitizeCell(a.workMode),
      techStack: sanitizeCell((a.techStack ?? []).join("|")),
      platform: sanitizeCell(r.platformName),
      priority: sanitizeCell(a.priority),
      jobUrl: sanitizeCell(a.jobUrl),
      jobId: sanitizeCell(a.jobId),
      notes: sanitizeCell(a.notes),
    };
  });

  return Papa.unparse({ fields: [...CSV_COLUMNS], data: records.map((r) => CSV_COLUMNS.map((c) => r[c])) });
}

/* --------------------------- Import: preview --------------------- */

interface RowError {
  row: number;
  messages: string[];
}

export async function previewImport(ownerId: string, csvText: string) {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const rawRows = parsed.data.slice(0, MAX_IMPORT_ROWS);
  if (rawRows.length === 0) throw ApiError.badRequest("CSV contains no data rows");

  const staged: (ImportRow & { _row: number })[] = [];
  const errors: RowError[] = [];
  const duplicates: { row: number; company: string; role: string }[] = [];

  rawRows.forEach((raw, index) => {
    const rowNum = index + 2; // header is row 1
    const result = importRowSchema.safeParse(raw);
    if (!result.success) {
      errors.push({
        row: rowNum,
        messages: result.error.issues.map((i) => `${i.path.join(".") || "row"}: ${i.message}`),
      });
      return;
    }
    staged.push({ ...result.data, _row: rowNum });
  });

  // Duplicate detection against existing data (warning only, PRD §6/§19).
  for (const row of staged) {
    const normalized = normalizeCompanyName(row.company);
    const [existing] = await db
      .select({ id: applications.id })
      .from(applications)
      .leftJoin(companies, eq(applications.companyId, companies.id))
      .where(
        and(
          eq(applications.ownerId, ownerId),
          eq(companies.normalizedName, normalized),
          ilike(applications.role, row.role),
        ),
      )
      .limit(1);
    if (existing) duplicates.push({ row: row._row, company: row.company, role: row.role });
  }

  const [job] = await db
    .insert(importJobs)
    .values({
      ownerId,
      state: "validated",
      totalRows: rawRows.length,
      validRows: staged.length,
      errorRows: errors.length,
      errorReport: errors,
      stagedData: staged,
    })
    .returning();

  return {
    importJobId: job.id,
    totalRows: rawRows.length,
    validRows: staged.length,
    errorRows: errors.length,
    errors,
    duplicates,
    sample: staged.slice(0, 10),
  };
}

/* --------------------------- Import: commit ---------------------- */

async function resolvePlatformId(ownerId: string, name?: string): Promise<string | undefined> {
  if (!name) return undefined;
  const [existing] = await db
    .select({ id: platforms.id })
    .from(platforms)
    .where(and(eq(platforms.ownerId, ownerId), ilike(platforms.name, name)))
    .limit(1);
  if (existing) return existing.id;
  const [created] = await db
    .insert(platforms)
    .values({ ownerId, name, isSystem: false })
    .returning({ id: platforms.id });
  return created.id;
}

export async function commitImport(ownerId: string, body: CommitImportBody) {
  const [job] = await db
    .select()
    .from(importJobs)
    .where(and(eq(importJobs.id, body.importJobId), eq(importJobs.ownerId, ownerId)))
    .limit(1);
  if (!job) throw ApiError.notFound("Import job not found");
  if (job.state !== "validated") {
    throw ApiError.badRequest(`Import job is '${job.state}', expected 'validated'`);
  }

  const staged = (job.stagedData as (ImportRow & { _row: number })[]) ?? [];
  let imported = 0;

  for (const row of staged) {
    const platformId = await resolvePlatformId(ownerId, row.platform);
    await applicationsService.createApplication(ownerId, {
      companyName: row.company,
      role: row.role,
      status: row.status,
      appliedDate: row.appliedDate,
      salaryMin: row.salaryMin ?? null,
      salaryMax: row.salaryMax ?? null,
      currency: row.currency,
      payPeriod: row.payPeriod,
      location: row.location,
      workMode: row.workMode,
      techStack: row.techStack ?? [],
      platformId,
      priority: row.priority,
      jobUrl: row.jobUrl,
      jobId: row.jobId,
      notes: row.notes,
    });
    imported += 1;
  }

  await db
    .update(importJobs)
    .set({ state: "committed", updatedAt: new Date() })
    .where(eq(importJobs.id, job.id));

  return { importJobId: job.id, imported };
}

export const commitImportSchema = commitImportBody;