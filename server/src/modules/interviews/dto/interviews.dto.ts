import { z } from "zod";
import {
  INTERVIEW_OUTCOMES,
  INTERVIEW_ROUNDS,
  INTERVIEW_STATUSES,
} from "../../../common/db/schema.js";

const emptyToUndef = (v: unknown) => (v === "" ? undefined : v);
const emptyOrNull = (v: unknown) => (v === "" || v === null ? undefined : v);

export const createInterviewBody = z
  .object({
    roundType: z.enum(INTERVIEW_ROUNDS).default("other"),
    status: z.enum(INTERVIEW_STATUSES).default("scheduled"),
    startTime: z.coerce.date({ error: "Invalid start time" }),
    endTime: z.preprocess(emptyOrNull, z.coerce.date().optional()),
    timezone: z.string().min(1).max(60).default("UTC"),
    location: z.preprocess(emptyOrNull, z.string().max(300).optional()),
    meetingLink: z.preprocess(emptyOrNull, z.string().url().max(1000).optional()),
    interviewer: z.preprocess(emptyOrNull, z.string().max(300).optional()),
    questions: z.preprocess(emptyOrNull, z.string().max(5000).optional()),
    prepNotes: z.preprocess(emptyOrNull, z.string().max(5000).optional()),
    outcome: z.enum(INTERVIEW_OUTCOMES).default("pending"),
  })
  .refine((d) => !d.endTime || d.endTime >= d.startTime, {
    message: "endTime cannot be before startTime",
    path: ["endTime"],
  });

export const updateInterviewBody = z
  .object({
    roundType: z.enum(INTERVIEW_ROUNDS).optional(),
    status: z.enum(INTERVIEW_STATUSES).optional(),
    startTime: z.preprocess(emptyToUndef, z.coerce.date().optional()),
    endTime: z.preprocess(emptyToUndef, z.coerce.date().nullable().optional()),
    timezone: z.string().min(1).max(60).optional(),
    location: z.preprocess(emptyToUndef, z.string().max(300).nullable().optional()),
    meetingLink: z.preprocess(emptyToUndef, z.string().url().max(1000).nullable().optional()),
    interviewer: z.preprocess(emptyToUndef, z.string().max(300).nullable().optional()),
    questions: z.preprocess(emptyToUndef, z.string().max(5000).nullable().optional()),
    prepNotes: z.preprocess(emptyToUndef, z.string().max(5000).nullable().optional()),
    outcome: z.enum(INTERVIEW_OUTCOMES).optional(),
  })
  .refine((d) => !d.startTime || !d.endTime || d.endTime >= d.startTime, {
    message: "endTime cannot be before startTime",
    path: ["endTime"],
  });

export const listInterviewsQuery = z.object({
  applicationId: z.string().uuid().optional(),
  status: z.enum(INTERVIEW_STATUSES).optional(),
  from: z.preprocess(emptyToUndef, z.coerce.date().optional()),
  to: z.preprocess(emptyToUndef, z.coerce.date().optional()),
  upcoming: z.enum(["true", "false"]).optional(),
});

export type CreateInterviewBody = z.infer<typeof createInterviewBody>;
export type UpdateInterviewBody = z.infer<typeof updateInterviewBody>;
export type ListInterviewsQuery = z.infer<typeof listInterviewsQuery>;