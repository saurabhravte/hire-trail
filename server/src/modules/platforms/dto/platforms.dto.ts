import { z } from "zod";

export const createPlatformBody = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
});

export const updatePlatformBody = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

export type CreatePlatformBody = z.infer<typeof createPlatformBody>;
export type UpdatePlatformBody = z.infer<typeof updatePlatformBody>;