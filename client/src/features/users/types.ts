import type { Theme } from "@/components/providers/theme-provider";

export interface UserPreferences {
  followUpThresholdDays: number;
  ghostedReviewThresholdDays: number;
  weeklyGoalDefault: number;
  notifyInterviews: boolean;
  notifyFollowUps: boolean;
}

export interface UserProfile {
  id: string;
  clerkUserId: string;
  displayName: string | null;
  timezone: string;
  theme: Theme;
  dateFormat: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePayload {
  displayName?: string | null;
  timezone?: string;
  theme?: Theme;
  dateFormat?: string;
}

export type PreferencesPayload = Partial<UserPreferences>;