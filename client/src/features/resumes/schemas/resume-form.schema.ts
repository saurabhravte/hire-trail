import { z } from "zod";
import type { ResumeVersion } from "../types";

export const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_BYTES = 5 * 1024 * 1024;

export const resumeFormSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(150),
  notes: z.string().optional().or(z.literal("")),
  isDefault: z.boolean(),
  coverLetterUrl: z.string().optional().or(z.literal("")),
  portfolioUrl: z.string().optional().or(z.literal("")),
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

export const emptyResumeValues: ResumeFormValues = {
  label: "",
  notes: "",
  isDefault: false,
  coverLetterUrl: "",
  portfolioUrl: "",
};

export function toResumeFormValues(r: ResumeVersion): ResumeFormValues {
  return {
    label: r.label,
    notes: r.notes ?? "",
    isDefault: r.isDefault,
    coverLetterUrl: r.coverLetterUrl ?? "",
    portfolioUrl: r.portfolioUrl ?? "",
  };
}

/** Validates a selected file client-side (server validates again). */
export function validateFile(file: File): string | null {
  if (!ALLOWED_MIME.includes(file.type)) return "Allowed types: PDF, DOC, DOCX";
  if (file.size > MAX_BYTES) return "File exceeds 5 MB";
  return null;
}

export function toResumeFormData(v: ResumeFormValues, file?: File | null): FormData {
  const form = new FormData();
  form.set("label", v.label.trim());
  form.set("isDefault", String(v.isDefault));
  if (v.notes?.trim()) form.set("notes", v.notes.trim());
  if (v.coverLetterUrl?.trim()) form.set("coverLetterUrl", v.coverLetterUrl.trim());
  if (v.portfolioUrl?.trim()) form.set("portfolioUrl", v.portfolioUrl.trim());
  if (file) form.set("file", file);
  return form;
}