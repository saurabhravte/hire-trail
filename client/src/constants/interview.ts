import type {
  InterviewOutcome,
  InterviewRound,
  InterviewStatus,
} from "@/constants/enums";

export const ROUND_LABELS: Record<InterviewRound, string> = {
  hr: "HR",
  technical: "Technical",
  managerial: "Managerial",
  coding_assessment: "Coding assessment",
  take_home: "Take-home",
  other: "Other",
};

export interface InterviewStatusConfig {
  label: string;
  badgeClass: string;
  dot: string;
}

export const INTERVIEW_STATUS_CONFIG: Record<InterviewStatus, InterviewStatusConfig> = {
  scheduled: {
    label: "Scheduled",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dot: "#3b82f6",
  },
  rescheduled: {
    label: "Rescheduled",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dot: "#f59e0b",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dot: "#10b981",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20 border-dashed",
    dot: "#9ca3af",
  },
  no_show: {
    label: "No-show",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dot: "#f43f5e",
  },
};

export const OUTCOME_LABELS: Record<InterviewOutcome, string> = {
  pending: "Pending",
  passed: "Passed",
  failed: "Failed",
};

export const DURATION_OPTIONS = [
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];
