import { resumeVersions } from "../../common/db/schema.js";

export { resumeVersions };

export type ResumeVersion = typeof resumeVersions.$inferSelect;
export type NewResumeVersion = typeof resumeVersions.$inferInsert;