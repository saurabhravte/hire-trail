import { z } from "zod";
import {
  isoDate,
  multiString,
  multiValue,
  paginationQuery,
} from "../../../common/dto/baseDto.js";
import {
  APPLICATION_STATUSES,
  PAY_PERIODS,
  PRIORITIES,
  WORK_MODES,
} from "../../../common/db/schema.js";

const money = z
  .number({ invalid_type_error: "Must be a number" })
  .nonnegative()
  .optional()
  .nullable();

const emptyToUndef = (v: unknown) => (v === "" ? undefined : v);

export const createApplicationBody = z
  .object({
    // Company: either an existing id OR a name to find-or-create. One is required.
    companyId: z.string().uuid().optional(),
    companyName: z.string().trim().max(200).optional(),

    role: z.string().trim().min(1, "Role is required").max(200),
    status: z.enum(APPLICATION_STATUSES).default("saved"),

    appliedDate: z.preprocess(emptyToUndef, isoDate.optional()),
    salaryMin: z.preprocess(emptyToUndef, money),
    salaryMax: z.preprocess(emptyToUndef, money),
    currency: z.preprocess(emptyToUndef, z.string().max(8).optional()),
    payPeriod: z.preprocess(emptyToUndef, z.enum(PAY_PERIODS).optional()),

    location: z.preprocess(emptyToUndef, z.string().max(200).optional()),
    workMode: z.preprocess(emptyToUndef, z.enum(WORK_MODES).optional()),
    techStack: z.array(z.string().trim().min(1)).max(50).default([]),

    platformId: z.preprocess(emptyToUndef, z.string().uuid().optional()),
    resumeVersionId: z.preprocess(emptyToUndef, z.string().uuid().optional()),

    jobUrl: z.preprocess(emptyToUndef, z.string().url().max(1000).optional()),
    jobId: z.preprocess(emptyToUndef, z.string().max(200).optional()),
    priority: z.enum(PRIORITIES).default("normal"),

    recruiterName: z.preprocess(emptyToUndef, z.string().max(200).optional()),
    recruiterEmail: z.preprocess(emptyToUndef, z.string().email().max(200).optional()),
    recruiterPhone: z.preprocess(emptyToUndef, z.string().max(50).optional()),
    referralPerson: z.preprocess(emptyToUndef, z.string().max(200).optional()),
    referralNotes: z.preprocess(emptyToUndef, z.string().max(2000).optional()),

    notes: z.preprocess(emptyToUndef, z.string().max(5000).optional()),
  })
  .refine((d) => d.companyId || d.companyName, {
    message: "companyId or companyName is required",
    path: ["companyName"],
  })
  .refine(
    (d) =>
      d.salaryMin == null || d.salaryMax == null || Number(d.salaryMin) <= Number(d.salaryMax),
    { message: "salaryMin cannot exceed salaryMax", path: ["salaryMin"] },
  );

// For PATCH: all optional, plus an optional status-change note.
export const updateApplicationBody = z
  .object({
    companyId: z.string().uuid().optional(),
    companyName: z.string().trim().max(200).optional(),
    role: z.string().trim().min(1).max(200).optional(),
    status: z.enum(APPLICATION_STATUSES).optional(),
    statusNote: z.string().max(1000).optional(),
    appliedDate: z.preprocess(emptyToUndef, isoDate.nullable().optional()),
    salaryMin: z.preprocess(emptyToUndef, money),
    salaryMax: z.preprocess(emptyToUndef, money),
    currency: z.preprocess(emptyToUndef, z.string().max(8).nullable().optional()),
    payPeriod: z.preprocess(emptyToUndef, z.enum(PAY_PERIODS).nullable().optional()),
    location: z.preprocess(emptyToUndef, z.string().max(200).nullable().optional()),
    workMode: z.preprocess(emptyToUndef, z.enum(WORK_MODES).nullable().optional()),
    techStack: z.array(z.string().trim().min(1)).max(50).optional(),
    platformId: z.preprocess(emptyToUndef, z.string().uuid().nullable().optional()),
    resumeVersionId: z.preprocess(emptyToUndef, z.string().uuid().nullable().optional()),
    jobUrl: z.preprocess(emptyToUndef, z.string().url().max(1000).nullable().optional()),
    jobId: z.preprocess(emptyToUndef, z.string().max(200).nullable().optional()),
    priority: z.enum(PRIORITIES).optional(),
    recruiterName: z.preprocess(emptyToUndef, z.string().max(200).nullable().optional()),
    recruiterEmail: z.preprocess(emptyToUndef, z.string().email().max(200).nullable().optional()),
    recruiterPhone: z.preprocess(emptyToUndef, z.string().max(50).nullable().optional()),
    referralPerson: z.preprocess(emptyToUndef, z.string().max(200).nullable().optional()),
    referralNotes: z.preprocess(emptyToUndef, z.string().max(2000).nullable().optional()),
    notes: z.preprocess(emptyToUndef, z.string().max(5000).nullable().optional()),
  })
  .refine(
    (d) =>
      d.salaryMin == null || d.salaryMax == null || Number(d.salaryMin) <= Number(d.salaryMax),
    { message: "salaryMin cannot exceed salaryMax", path: ["salaryMin"] },
  );

export const SORT_FIELDS = [
  "company",
  "role",
  "appliedDate",
  "salary",
  "status",
  "updatedAt",
  "priority",
] as const;

export const listApplicationsQuery = paginationQuery.extend({
  q: z.string().trim().optional(),
  status: multiValue(APPLICATION_STATUSES),
  workMode: multiValue(WORK_MODES),
  priority: multiValue(PRIORITIES),
  platformId: multiString, // uuid strings
  techStack: multiString,
  location: z.string().trim().optional(),
  companyId: z.string().uuid().optional(),
  appliedFrom: isoDate.optional(),
  appliedTo: isoDate.optional(),
  archived: z.enum(["true", "false", "all"]).default("false"),
  sort: z.enum(SORT_FIELDS).default("updatedAt"),
  dir: z.enum(["asc", "desc"]).default("desc"),
});

export const archiveQuery = z.object({}); // no body needed

export const statusChangeBody = z.object({
  status: z.enum(APPLICATION_STATUSES),
  note: z.string().max(1000).optional(),
});

export const bulkActionBody = z.object({
  ids: z.array(z.string().uuid()).min(1, "Select at least one application").max(500),
  action: z.enum(["archive", "restore", "delete"]),
});

export const duplicateCheckQuery = z.object({
  companyName: z.string().trim().optional(),
  role: z.string().trim().optional(),
  jobUrl: z.string().trim().optional(),
});

export type CreateApplicationBody = z.infer<typeof createApplicationBody>;
export type UpdateApplicationBody = z.infer<typeof updateApplicationBody>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuery>;
export type StatusChangeBody = z.infer<typeof statusChangeBody>;
export type BulkActionBody = z.infer<typeof bulkActionBody>;
export type DuplicateCheckQuery = z.infer<typeof duplicateCheckQuery>;