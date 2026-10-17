import { tasks } from "../../common/db/schema.js";

export { tasks };

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;