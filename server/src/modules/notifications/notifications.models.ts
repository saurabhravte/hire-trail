import { notifications } from "../../common/db/schema.js";

export { notifications };

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;