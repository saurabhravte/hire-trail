import type { InterviewOutcome, InterviewRound, InterviewStatus } from "@/constants/enums";

export interface Interview {
  id: string;
  applicationId: string;
  ownerId: string;
  roundType: InterviewRound;
  status: InterviewStatus;
  startTime: string;
  endTime: string | null;
  timezone: string;
  location: string | null;
  meetingLink: string | null;
  interviewer: string | null;
  questions: string | null;
  prepNotes: string | null;
  outcome: InterviewOutcome;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewPayload {
  roundType: InterviewRound;
  status: InterviewStatus;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string | null;
  meetingLink?: string | null;
  interviewer?: string | null;
  questions?: string | null;
  prepNotes?: string | null;
  outcome: InterviewOutcome;
}

export interface InterviewListParams {
  applicationId?: string;
  status?: InterviewStatus;
  upcoming?: "true" | "false";
}