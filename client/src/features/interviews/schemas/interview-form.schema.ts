import { z } from "zod";
import {
  INTERVIEW_OUTCOMES,
  INTERVIEW_ROUNDS,
  INTERVIEW_STATUSES,
} from "@/constants/enums";
import {
  addMinutesIso,
  durationMinutes,
  getLocalTimezone,
  utcIsoToZonedInput,
  zonedInputToUtcIso,
} from "@/lib/datetime";
import type { Interview, InterviewPayload } from "../types";

export const interviewFormSchema = z
  .object({
    applicationId: z.string().min(1, "Select an application"),
    roundType: z.enum(INTERVIEW_ROUNDS),
    status: z.enum(INTERVIEW_STATUSES),
    startLocal: z.string().min(1, "Start time is required"),
    timezone: z.string().min(1, "Timezone is required"),
    durationMinutes: z.string(),
    location: z.string().optional().or(z.literal("")),
    meetingLink: z.string().optional().or(z.literal("")),
    interviewer: z.string().optional().or(z.literal("")),
    questions: z.string().optional().or(z.literal("")),
    prepNotes: z.string().optional().or(z.literal("")),
    outcome: z.enum(INTERVIEW_OUTCOMES),
  })
  .superRefine((v, ctx) => {
    if (v.meetingLink && !isValidUrl(v.meetingLink)) {
      ctx.addIssue({ code: "custom", path: ["meetingLink"], message: "Enter a valid URL" });
    }
  });

export type InterviewFormValues = z.infer<typeof interviewFormSchema>;

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const blank = (v?: string) => (v && v.trim() !== "" ? v.trim() : null);

export function emptyInterviewValues(
  applicationId = "",
  defaultDate?: string,
): InterviewFormValues {
  return {
    applicationId,
    roundType: "technical",
    status: "scheduled",
    startLocal: defaultDate ? `${defaultDate}T10:00` : "",
    timezone: getLocalTimezone(),
    durationMinutes: "60",
    location: "",
    meetingLink: "",
    interviewer: "",
    questions: "",
    prepNotes: "",
    outcome: "pending",
  };
}

export function toInterviewFormValues(iv: Interview): InterviewFormValues {
  return {
    applicationId: iv.applicationId,
    roundType: iv.roundType,
    status: iv.status,
    startLocal: utcIsoToZonedInput(iv.startTime, iv.timezone),
    timezone: iv.timezone,
    durationMinutes: String(durationMinutes(iv.startTime, iv.endTime)),
    location: iv.location ?? "",
    meetingLink: iv.meetingLink ?? "",
    interviewer: iv.interviewer ?? "",
    questions: iv.questions ?? "",
    prepNotes: iv.prepNotes ?? "",
    outcome: iv.outcome,
  };
}

export function toInterviewPayload(v: InterviewFormValues): InterviewPayload {
  const startTime = zonedInputToUtcIso(v.startLocal, v.timezone);
  const endTime = addMinutesIso(startTime, Number(v.durationMinutes) || 60);
  return {
    roundType: v.roundType,
    status: v.status,
    startTime,
    endTime,
    timezone: v.timezone,
    location: blank(v.location),
    meetingLink: blank(v.meetingLink),
    interviewer: blank(v.interviewer),
    questions: blank(v.questions),
    prepNotes: blank(v.prepNotes),
    outcome: v.outcome,
  };
}