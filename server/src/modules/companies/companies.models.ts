import { companies, contacts } from "../../common/db/schema.js";

export { companies, contacts };

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

/** Normalize a company name for duplicate *warnings* (never auto-merge). */
export function normalizeCompanyName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}