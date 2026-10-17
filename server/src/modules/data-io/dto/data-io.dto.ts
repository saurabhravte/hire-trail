import { z } from "zod";
import {
  APPLICATION_STATUSES,
  PAY_PERIODS,
  PRIORITIES,
  WORK_MODES,
} from "../../../common/db/schema.js";
import { isoDate } from "../../../common/dto/baseDto.js";

const emptyToUndef = (v: unknown) => {
  if (typeof v === "string") {
    const t = v.trim();
    return t === "" ? undefined : t;
  }
  return v ?? undefined;
};

/** Normalize a label like "Offer Received" -> "offer_received" before enum parse. */
const enumish = (v: unknown) => {
  const s = emptyToUndef(v);
  return typeof s === "string" ? s.toLowerCase().replace(/[\s-]+/g, "_") : s;
};

const money = z.preprocess((v) => {
  const s = emptyToUndef(v);
  if (s === undefined) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : s; // invalid -> let zod flag it
}, z.number().nonnegative().optional());

/** One parsed CSV row. Produces a commit-ready, normalized object. */
export const importRowSchema = z
  .object({
    company: z.preprocess(emptyToUndef, z.string().trim().min(1, "company is required").max(200)),
    role: z.preprocess(emptyToUndef, z.string().trim().min(1, "role is required").max(200)),
    status: z.preprocess(enumish, z.enum(APPLICATION_STATUSES).default("saved")),
    appliedDate: z.preprocess(emptyToUndef, isoDate.optional()),
    salaryMin: money,
    salaryMax: money,
    currency: z.preprocess(emptyToUndef, z.string().max(8).optional()),
    payPeriod: z.preprocess(enumish, z.enum(PAY_PERIODS).optional()),
    location: z.preprocess(emptyToUndef, z.string().max(200).optional()),
    workMode: z.preprocess(enumish, z.enum(WORK_MODES).optional()),
    techStack: z.preprocess((v) => {
      const s = emptyToUndef(v);
      if (typeof s !== "string") return [];
      return s.split(/[|,]/).map((x) => x.trim()).filter(Boolean);
    }, z.array(z.string()).max(50)),
    platform: z.preprocess(emptyToUndef, z.string().max(100).optional()),
    priority: z.preprocess(enumish, z.enum(PRIORITIES).default("normal")),
    jobUrl: z.preprocess(emptyToUndef, z.string().url().max(1000).optional()),
    jobId: z.preprocess(emptyToUndef, z.string().max(200).optional()),
    notes: z.preprocess(emptyToUndef, z.string().max(5000).optional()),
  })
  .refine(
    (d) => d.salaryMin == null || d.salaryMax == null || d.salaryMin <= d.salaryMax,
    { message: "salaryMin cannot exceed salaryMax", path: ["salaryMin"] },
  );

export const commitImportBody = z.object({
  importJobId: z.string().uuid(),
});

export type ImportRow = z.infer<typeof importRowSchema>;
export type CommitImportBody = z.infer<typeof commitImportBody>;