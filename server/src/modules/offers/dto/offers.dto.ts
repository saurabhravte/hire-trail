import { z } from "zod";
import { OFFER_DECISIONS, PAY_PERIODS, WORK_MODES } from "../../../common/db/schema.js";
import { isoDate } from "../../../common/dto/baseDto.js";

const emptyToUndef = (v: unknown) => (v === "" ? undefined : v);
const emptyOrNull = (v: unknown) => (v === "" || v === null ? undefined : v);
const money = z.preprocess(emptyToUndef, z.number().nonnegative().nullable().optional());

export const createOfferBody = z.object({
  applicationId: z.string().uuid(),
  basePay: money,
  variablePay: money,
  bonus: money,
  equityNotes: z.preprocess(emptyOrNull, z.string().max(2000).optional()),
  currency: z.preprocess(emptyOrNull, z.string().max(8).optional()),
  payPeriod: z.preprocess(emptyToUndef, z.enum(PAY_PERIODS).optional()),
  benefits: z.preprocess(emptyOrNull, z.string().max(2000).optional()),
  workMode: z.preprocess(emptyToUndef, z.enum(WORK_MODES).optional()),
  location: z.preprocess(emptyOrNull, z.string().max(200).optional()),
  joiningDate: z.preprocess(emptyOrNull, isoDate.optional()),
  deadline: z.preprocess(emptyOrNull, isoDate.optional()),
  decision: z.enum(OFFER_DECISIONS).default("pending"),
});

export const updateOfferBody = createOfferBody.partial().omit({ applicationId: true });

export const compareQuery = z.object({
  ids: z.preprocess(
    (v) => (typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : v),
    z.array(z.string().uuid()).min(2, "Select at least two offers").max(10),
  ),
});

export type CreateOfferBody = z.infer<typeof createOfferBody>;
export type UpdateOfferBody = z.infer<typeof updateOfferBody>;
export type CompareQuery = z.infer<typeof compareQuery>;