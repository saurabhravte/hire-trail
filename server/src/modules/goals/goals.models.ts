import { weeklyGoals } from "../../common/db/schema.js";

export { weeklyGoals };

export type WeeklyGoal = typeof weeklyGoals.$inferSelect;