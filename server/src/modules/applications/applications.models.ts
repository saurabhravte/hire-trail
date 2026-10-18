import {
  applications,
  applicationActivity,
  applicationStatusHistory,
} from "../../common/db/schema.js";

export { applications, applicationActivity, applicationStatusHistory };

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

/** Canonical activity event types written to application_activity (PRD §13). */
export const ACTIVITY_EVENTS = {
  CREATED: "created",
  UPDATED: "updated",
  NOTE_EDITED: "note_edited",
  STATUS_CHANGED: "status_changed",
  ARCHIVED: "archived",
  RESTORED: "restored",
} as const;

export type ActivityEvent = (typeof ACTIVITY_EVENTS)[keyof typeof ACTIVITY_EVENTS];
