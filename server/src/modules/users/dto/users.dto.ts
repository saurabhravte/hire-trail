import { z } from "zod";
import { THEMES } from "../../../common/db/schema.js";

const timezone = z
  .string()
  .min(1)
  .max(60)
  .refine((tz) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }, "Invalid IANA timezone");

export const updateProfileBody = z.object({
  displayName: z.string().trim().max(150).nullable().optional(),
  timezone: timezone.optional(),
  theme: z.enum(THEMES).optional(),
  dateFormat: z.string().trim().min(1).max(40).optional(),
});

export const updatePreferencesBody = z
  .object({
    followUpThresholdDays: z.number().int().min(1).max(365).optional(),
    ghostedReviewThresholdDays: z.number().int().min(1).max(365).optional(),
    weeklyGoalDefault: z.number().int().min(0).max(1000).optional(),
    notifyInterviews: z.boolean().optional(),
    notifyFollowUps: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: "Provide at least one preference" });

export type UpdateProfileBody = z.infer<typeof updateProfileBody>;
export type UpdatePreferencesBody = z.infer<typeof updatePreferencesBody>;