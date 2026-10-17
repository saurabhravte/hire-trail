import { z } from "zod";
import { isoDate } from "../../../common/dto/baseDto.js";

export const analyticsRangeQuery = z.object({
  from: isoDate.optional(),
  to: isoDate.optional(),
});

export const activityQuery = analyticsRangeQuery.extend({
  groupBy: z.enum(["day", "week", "month"]).default("week"),
});

export type AnalyticsRangeQuery = z.infer<typeof analyticsRangeQuery>;
export type ActivityQuery = z.infer<typeof activityQuery>;