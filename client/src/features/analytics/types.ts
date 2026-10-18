import type { ApplicationStatus } from "@/constants/enums";
import type { WeeklyGoalProgress } from "@/features/goals/types";

export interface AnalyticsOverview {
  totals: {
    submitted: number;
    active: number;
    offersReceived: number;
    offersAccepted: number;
    rejections: number;
    ghosted: number;
    withdrawn: number;
    saved: number;
  };
  funnel: { applied: number; interview: number; offer: number; accepted: number };
  statusDistribution: { status: ApplicationStatus; count: number }[];
  upcomingInterviewsCount: number;
  upcomingInterviews: UpcomingInterview[];
  pendingTasksCount: number;
  overdueTasksCount: number;
  weeklyGoal: WeeklyGoalProgress;
}

export interface UpcomingInterview {
  id: string;
  applicationId: string;
  roundType: string;
  status: string;
  startTime: string;
  timezone: string;
  meetingLink: string | null;
  location: string | null;
}

export interface SampleMetric {
  value: number | null;
  sampleSize: number;
}

export interface AnalyticsConversion {
  submitted: number;
  responded: number;
  responseRate: number;
  reachedInterview: number;
  interviewConversion: number;
  offersReceived: number;
  offerRate: number;
  offersAccepted: number;
  acceptanceRate: number;
  avgDaysToFirstResponse: SampleMetric;
  avgDaysToInterview: SampleMetric;
}

export interface BreakdownRow {
  label: string;
  submitted: number;
  responded: number;
  responseRate: number;
}

export interface AnalyticsBreakdowns {
  byPlatform: BreakdownRow[];
  byResume: BreakdownRow[];
  byRole: BreakdownRow[];
  byTechStack: BreakdownRow[];
}

export interface ActivityPoint {
  bucket: string;
  count: number;
}

export interface AnalyticsRange {
  from?: string;
  to?: string;
}

export type ActivityGroupBy = "day" | "week" | "month";