import { z } from "zod";
import type { Contact, ContactPayload } from "../types";

const optional = z.string().trim().optional().or(z.literal(""));

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200),
    role: optional,
    email: optional,
    phone: optional,
    linkedinUrl: optional,
    notes: optional,
  })
  .superRefine((v, ctx) => {
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Enter a valid email" });
    }
    if (v.linkedinUrl && !isUrl(v.linkedinUrl)) {
      ctx.addIssue({ code: "custom", path: ["linkedinUrl"], message: "Enter a valid URL" });
    }
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const blank = (v?: string) => (v && v.trim() !== "" ? v.trim() : null);

export const emptyContactValues: ContactFormValues = {
  name: "",
  role: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  notes: "",
};

export function toContactFormValues(c: Contact): ContactFormValues {
  return {
    name: c.name,
    role: c.role ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    linkedinUrl: c.linkedinUrl ?? "",
    notes: c.notes ?? "",
  };
}

export function toContactPayload(v: ContactFormValues, companyId?: string | null): ContactPayload {
  return {
    name: v.name.trim(),
    role: blank(v.role),
    email: blank(v.email),
    phone: blank(v.phone),
    linkedinUrl: blank(v.linkedinUrl),
    notes: blank(v.notes),
    companyId: companyId ?? null,
  };
}