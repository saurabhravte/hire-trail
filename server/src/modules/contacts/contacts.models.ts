import { contacts } from "../../common/db/schema.js";

export { contacts };

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;