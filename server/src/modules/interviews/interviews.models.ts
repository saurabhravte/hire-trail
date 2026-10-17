import { interviews } from "../../common/db/schema.js";

export { interviews };

export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;