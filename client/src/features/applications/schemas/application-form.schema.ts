import { z } from "zod";
import { APPLICATION_STATUSES, PRIORITIES } from "@/constants/enums";
import type { Application, ApplicationPayload } from "../types";

export const NONE = "__none__";

const optional = z.string().trim().optional().or(z.literal(""));

export const applicationFormSchema = z
  .object({
    companyName: z.string().trim().min(1, "Company is required").max(200),
    role: z.string().trim().min(1, "Role is required").max(200),
    status: z.enum(APPLICATION_STATUSES),
    priority: z.enum(PRIORITIES),
    appliedDate: optional,
    salaryMin: optional,
    salaryMax: optional,
    currency: optional,
    payPeriod: z.string().optional(),
    location: optional,
    workMode: z.string().optional(),
    techStack: optional, // comma-separated in the field
    platformId: z.string().optional(),
    resumeVersionId: z.string().optional(),
    jobUrl: optional,
    jobId: optional,
    recruiterName: optional,
    recruiterEmail: optional,
    recruiterPhone: optional,
    referralPerson: optional,
    referralNotes: optional,
    notes: optional,
  })
  .superRefine((v, ctx) => {
    const min = v.salaryMin ? Number(v.salaryMin) : undefined;
    const max = v.salaryMax ? Number(v.salaryMax) : undefined;
    if (v.salaryMin && Number.isNaN(min)) {
      ctx.addIssue({ code: "custom", path: ["salaryMin"], message: "Must be a number" });
    }
    if (v.salaryMax && Number.isNaN(max)) {
      ctx.addIssue({ code: "custom", path: ["salaryMax"], message: "Must be a number" });
    }
    if (min != null && max != null && !Number.isNaN(min) && !Number.isNaN(max) && min > max) {
      ctx.addIssue({ code: "custom", path: ["salaryMin"], message: "Min cannot exceed max" });
    }
    if (v.jobUrl && !isValidUrl(v.jobUrl)) {
      ctx.addIssue({ code: "custom", path: ["jobUrl"], message: "Enter a valid URL" });
    }
    if (v.recruiterEmail && !isValidEmail(v.recruiterEmail)) {
      ctx.addIssue({ code: "custom", path: ["recruiterEmail"], message: "Enter a valid email" });
    }
    if (v.status !== "saved" && !v.appliedDate) {
      ctx.addIssue({
        code: "custom",
        path: ["appliedDate"],
        message: "Applied date is required once you’ve applied",
      });
    }
  });

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const blank = (v?: string) => (v && v.trim() !== "" ? v.trim() : undefined);
const select = (v?: string) => (v && v !== NONE ? v : undefined);

export const emptyFormValues: ApplicationFormValues = {
  companyName: "",
  role: "",
  status: "saved",
  priority: "normal",
  appliedDate: "",
  salaryMin: "",
  salaryMax: "",
  currency: "",
  payPeriod: NONE,
  location: "",
  workMode: NONE,
  techStack: "",
  platformId: NONE,
  resumeVersionId: NONE,
  jobUrl: "",
  jobId: "",
  recruiterName: "",
  recruiterEmail: "",
  recruiterPhone: "",
  referralPerson: "",
  referralNotes: "",
  notes: "",
};

export function toFormValues(app: Application): ApplicationFormValues {
  return {
    companyName: app.companyName ?? "",
    role: app.role,
    status: app.status,
    priority: app.priority,
    appliedDate: app.appliedDate ?? "",
    salaryMin: app.salaryMin != null ? String(app.salaryMin) : "",
    salaryMax: app.salaryMax != null ? String(app.salaryMax) : "",
    currency: app.currency ?? "",
    payPeriod: app.payPeriod ?? NONE,
    location: app.location ?? "",
    workMode: app.workMode ?? NONE,
    techStack: app.techStack.join(", "),
    platformId: app.platformId ?? NONE,
    resumeVersionId: app.resumeVersionId ?? NONE,
    jobUrl: app.jobUrl ?? "",
    jobId: app.jobId ?? "",
    recruiterName: app.recruiterName ?? "",
    recruiterEmail: app.recruiterEmail ?? "",
    recruiterPhone: app.recruiterPhone ?? "",
    referralPerson: app.referralPerson ?? "",
    referralNotes: app.referralNotes ?? "",
    notes: app.notes ?? "",
  };
}

export function toApiPayload(v: ApplicationFormValues): ApplicationPayload {
  return {
    companyName: v.companyName.trim(),
    role: v.role.trim(),
    status: v.status,
    priority: v.priority,
    appliedDate: blank(v.appliedDate) ?? null,
    salaryMin: v.salaryMin ? Number(v.salaryMin) : null,
    salaryMax: v.salaryMax ? Number(v.salaryMax) : null,
    currency: blank(v.currency) ?? null,
    payPeriod: (select(v.payPeriod) as ApplicationPayload["payPeriod"]) ?? null,
    location: blank(v.location) ?? null,
    workMode: (select(v.workMode) as ApplicationPayload["workMode"]) ?? null,
    techStack: v.techStack
      ? v.techStack.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    platformId: select(v.platformId) ?? null,
    resumeVersionId: select(v.resumeVersionId) ?? null,
    jobUrl: blank(v.jobUrl) ?? null,
    jobId: blank(v.jobId) ?? null,
    recruiterName: blank(v.recruiterName) ?? null,
    recruiterEmail: blank(v.recruiterEmail) ?? null,
    recruiterPhone: blank(v.recruiterPhone) ?? null,
    referralPerson: blank(v.referralPerson) ?? null,
    referralNotes: blank(v.referralNotes) ?? null,
    notes: blank(v.notes) ?? null,
  };
}