import { userProfiles } from "../../common/db/schema.js";

export { userProfiles };

export type UserProfile = typeof userProfiles.$inferSelect;

export type UserPreferences = {
  followUpThresholdDays: number;
  ghostedReviewThresholdDays: number;
  weeklyGoalDefault: number;
  notifyInterviews: boolean;
  notifyFollowUps: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  followUpThresholdDays: 7,
  ghostedReviewThresholdDays: 14,
  weeklyGoalDefault: 5,
  notifyInterviews: true,
  notifyFollowUps: true,
};