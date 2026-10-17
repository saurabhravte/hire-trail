import { z } from "zod";

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParam = z.object({
  id: z.string().uuid("Invalid id"),
});

/** Coerce ?x=a,b or ?x=a&x=b (or single value) into string[]. */
export const multiValue = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess((v) => {
    if (v === undefined || v === null || v === "") return undefined;
    if (Array.isArray(v)) return v;
    return String(v)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, z.array(z.enum(values)).optional());

export const multiString = z.preprocess((v) => {
  if (v === undefined || v === null || v === "") return undefined;
  if (Array.isArray(v)) return v;
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}, z.array(z.string()).optional());

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export type PaginationQuery = z.infer<typeof paginationQuery>;
export type IdParam = z.infer<typeof idParam>;