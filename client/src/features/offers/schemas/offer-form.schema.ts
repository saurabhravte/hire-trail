import { z } from "zod";
import { OFFER_DECISIONS, PAY_PERIODS, WORK_MODES } from "@/constants/enums";
import type { Offer, OfferPayload } from "../types";

export const NONE = "__none__";
const optional = z.string().trim().optional().or(z.literal(""));

export const offerFormSchema = z
  .object({
    applicationId: z.string().min(1, "Select an application"),
    basePay: optional,
    variablePay: optional,
    bonus: optional,
    equityNotes: optional,
    currency: optional,
    payPeriod: z.string(),
    benefits: optional,
    workMode: z.string(),
    location: optional,
    joiningDate: optional,
    deadline: optional,
    decision: z.enum(OFFER_DECISIONS),
  })
  .superRefine((v, ctx) => {
    for (const key of ["basePay", "variablePay", "bonus"] as const) {
      if (v[key] && Number.isNaN(Number(v[key]))) {
        ctx.addIssue({ code: "custom", path: [key], message: "Must be a number" });
      }
    }
  });

export type OfferFormValues = z.infer<typeof offerFormSchema>;

const blank = (v?: string) => (v && v.trim() !== "" ? v.trim() : null);
const money = (v?: string) => (v && v.trim() !== "" ? Number(v) : null);
const select = (v?: string) => (v && v !== NONE ? v : null);

export function emptyOfferValues(applicationId = ""): OfferFormValues {
  return {
    applicationId,
    basePay: "",
    variablePay: "",
    bonus: "",
    equityNotes: "",
    currency: "",
    payPeriod: NONE,
    benefits: "",
    workMode: NONE,
    location: "",
    joiningDate: "",
    deadline: "",
    decision: "pending",
  };
}

export function toOfferFormValues(o: Offer): OfferFormValues {
  return {
    applicationId: o.applicationId,
    basePay: o.basePay != null ? String(o.basePay) : "",
    variablePay: o.variablePay != null ? String(o.variablePay) : "",
    bonus: o.bonus != null ? String(o.bonus) : "",
    equityNotes: o.equityNotes ?? "",
    currency: o.currency ?? "",
    payPeriod: o.payPeriod ?? NONE,
    benefits: o.benefits ?? "",
    workMode: o.workMode ?? NONE,
    location: o.location ?? "",
    joiningDate: o.joiningDate ?? "",
    deadline: o.deadline ?? "",
    decision: o.decision,
  };
}

export function toOfferPayload(v: OfferFormValues): OfferPayload {
  return {
    applicationId: v.applicationId,
    basePay: money(v.basePay),
    variablePay: money(v.variablePay),
    bonus: money(v.bonus),
    equityNotes: blank(v.equityNotes),
    currency: blank(v.currency),
    payPeriod: select(v.payPeriod) as OfferPayload["payPeriod"],
    benefits: blank(v.benefits),
    workMode: select(v.workMode) as OfferPayload["workMode"],
    location: blank(v.location),
    joiningDate: blank(v.joiningDate),
    deadline: blank(v.deadline),
    decision: v.decision,
  };
}

export { PAY_PERIODS, WORK_MODES, OFFER_DECISIONS };