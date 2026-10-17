export const APPLICATION_STATUSES = [
  "saved",
  "applied",
  "interview",
  "offer_received",
  "accepted",
  "rejected",
  "ghosted",
  "withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const WORK_MODES = ["remote", "hybrid", "onsite"] as const;
export type WorkMode = (typeof WORK_MODES)[number];

export const PAY_PERIODS = ["hourly", "monthly", "yearly"] as const;
export type PayPeriod = (typeof PAY_PERIODS)[number];

export const PRIORITIES = ["normal", "high", "dream"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const INTERVIEW_ROUNDS = [
  "hr",
  "technical",
  "managerial",
  "coding_assessment",
  "take_home",
  "other",
] as const;
export type InterviewRound = (typeof INTERVIEW_ROUNDS)[number];

export const INTERVIEW_STATUSES = [
  "scheduled",
  "rescheduled",
  "completed",
  "cancelled",
  "no_show",
] as const;
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export const INTERVIEW_OUTCOMES = ["pending", "passed", "failed"] as const;
export type InterviewOutcome = (typeof INTERVIEW_OUTCOMES)[number];

export const TASK_PRIORITIES = ["low", "normal", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const OFFER_DECISIONS = ["pending", "accepted", "declined", "expired"] as const;
export type OfferDecision = (typeof OFFER_DECISIONS)[number];