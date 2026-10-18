import { z } from "zod";
import type { Company, CompanyPayload } from "../types";

const optional = z.string().trim().optional().or(z.literal(""));

export const companyFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200),
    website: optional,
    notes: optional,
  })
  .superRefine((v, ctx) => {
    if (v.website && !isUrl(v.website)) {
      ctx.addIssue({ code: "custom", path: ["website"], message: "Enter a valid URL" });
    }
  });

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const blank = (v?: string) => (v && v.trim() !== "" ? v.trim() : null);

export const emptyCompanyValues: CompanyFormValues = { name: "", website: "", notes: "" };

export function toCompanyFormValues(c: Company): CompanyFormValues {
  return { name: c.name, website: c.website ?? "", notes: c.notes ?? "" };
}

export function toCompanyPayload(v: CompanyFormValues): CompanyPayload {
  return { name: v.name.trim(), website: blank(v.website), notes: blank(v.notes) };
}