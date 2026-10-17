import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics.service";
import type { AnalyticsRange } from "../types";

export const analyticsKeys = {
  overview: (range?: AnalyticsRange) => ["analytics", "overview", range ?? {}] as const,
};

export function useOverview(range?: AnalyticsRange) {
  return useQuery({
    queryKey: analyticsKeys.overview(range),
    queryFn: () => analyticsService.overview(range),
  });
}