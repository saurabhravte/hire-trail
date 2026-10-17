import { platforms } from "../../common/db/schema.js";

export { platforms };

export type Platform = typeof platforms.$inferSelect;
export type NewPlatform = typeof platforms.$inferInsert;

/** Seeded on first list if the user has no platforms yet (PRD §11). */
export const DEFAULT_PLATFORMS = [
  "LinkedIn",
  "Naukri",
  "Wellfound",
  "Company career page",
  "Referral",
  "Indeed",
  "Other",
];