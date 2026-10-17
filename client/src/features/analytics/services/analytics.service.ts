import { api } from "@/lib/api-client";
import type { AnalyticsOverview, AnalyticsRange } from "../types";

export const analyticsService = {
  overview: (range?: AnalyticsRange) =>
    api.get<AnalyticsOverview>("/analytics/overview", range as Record<string, unknown>),
};