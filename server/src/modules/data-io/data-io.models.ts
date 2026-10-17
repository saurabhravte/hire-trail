import { importJobs } from "../../common/db/schema.js";

export { importJobs };

export type ImportJob = typeof importJobs.$inferSelect;

/** Canonical CSV columns for export and import. */
export const CSV_COLUMNS = [
  "company",
  "role",
  "status",
  "appliedDate",
  "salaryMin",
  "salaryMax",
  "currency",
  "payPeriod",
  "location",
  "workMode",
  "techStack",
  "platform",
  "priority",
  "jobUrl",
  "jobId",
  "notes",
] as const;