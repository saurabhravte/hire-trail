import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics.service";
import type { ActivityGroupBy, AnalyticsRange } from "../types";

export const analyticsKeys = {
  overview: (range?: AnalyticsRange) => ["analytics", "overview", range ?? {}] as const,
  conversion: (range?: AnalyticsRange) => ["analytics", "conversion", range ?? {}] as const,
  breakdowns: (range?: AnalyticsRange) => ["analytics", "breakdowns", range ?? {}] as const,
  activity: (range: AnalyticsRange, groupBy: ActivityGroupBy) =>
    ["analytics", "activity", range, groupBy] as const,
};

export function useOverview(range?: AnalyticsRange) {
  return useQuery({
    queryKey: analyticsKeys.overview(range),
    queryFn: () => analyticsService.overview(range),
  });
}

export function useConversion(range?: AnalyticsRange) {
  return useQuery({
    queryKey: analyticsKeys.conversion(range),
    queryFn: () => analyticsService.conversion(range),
  });
}

export function useBreakdowns(range?: AnalyticsRange) {
  return useQuery({
    queryKey: analyticsKeys.breakdowns(range),
    queryFn: () => analyticsService.breakdowns(range),
  });
}

export function useActivity(range: AnalyticsRange, groupBy: ActivityGroupBy) {
  return useQuery({
    queryKey: analyticsKeys.activity(range, groupBy),
    queryFn: () => analyticsService.activity({ ...range, groupBy }),
  });
}