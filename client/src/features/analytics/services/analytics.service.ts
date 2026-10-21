import { api } from "@/lib/api-client";
import type {
  ActivityGroupBy,
  ActivityPoint,
  AnalyticsBreakdowns,
  AnalyticsConversion,
  AnalyticsOverview,
  AnalyticsRange,
} from "../types";

export const analyticsService = {
  overview: (range?: AnalyticsRange) =>
    api.get<AnalyticsOverview>("/analytics/overview", range as Record<string, unknown>),
  conversion: (range?: AnalyticsRange) =>
    api.get<AnalyticsConversion>("/analytics/conversion", range as Record<string, unknown>),
  breakdowns: (range?: AnalyticsRange) =>
    api.get<AnalyticsBreakdowns>("/analytics/breakdowns", range as Record<string, unknown>),
  activity: (range: AnalyticsRange & { groupBy: ActivityGroupBy }) =>
    api.get<ActivityPoint[]>("/analytics/activity", range as unknown as Record<string, unknown>),
};