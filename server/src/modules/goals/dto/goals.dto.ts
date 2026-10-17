import { z } from "zod";

export const upsertGoalBody = z.object({
  targetCount: z.number().int().min(0).max(1000),
  isPaused: z.boolean().optional(),
});

export type UpsertGoalBody = z.infer<typeof upsertGoalBody>;