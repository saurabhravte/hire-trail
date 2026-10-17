import { z } from "zod";

const emptyToUndef = (v: unknown) => (v === "" ? undefined : v);
const coerceBool = z.preprocess(
  (v) => (v === "true" || v === true ? true : v === "false" || v === false ? false : v),
  z.boolean().optional(),
);

export const createResumeBody = z.object({
  label: z.string().trim().min(1, "Label is required").max(150),
  notes: z.preprocess(emptyToUndef, z.string().max(2000).optional()),
  isDefault: coerceBool,
  coverLetterUrl: z.preprocess(emptyToUndef, z.string().url().max(1000).optional()),
  portfolioUrl: z.preprocess(emptyToUndef, z.string().url().max(1000).optional()),
});

export const updateResumeBody = z.object({
  label: z.string().trim().min(1).max(150).optional(),
  notes: z.preprocess(emptyToUndef, z.string().max(2000).nullable().optional()),
  isDefault: coerceBool,
  coverLetterUrl: z.preprocess(emptyToUndef, z.string().url().max(1000).nullable().optional()),
  portfolioUrl: z.preprocess(emptyToUndef, z.string().url().max(1000).nullable().optional()),
});

export type CreateResumeBody = z.infer<typeof createResumeBody>;
export type UpdateResumeBody = z.infer<typeof updateResumeBody>;