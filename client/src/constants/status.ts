import type { ApplicationStatus } from "./enums";

export interface StatusConfig {
  value: ApplicationStatus;
  label: string;
  badgeClass: string;
  color: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  saved: {
    value: "saved",
    label: "Saved",
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
    color: "#64748b",
  },
  applied: {
    value: "applied",
    label: "Applied",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    color: "#3b82f6",
  },
  interview: {
    value: "interview",
    label: "Interview",
    badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    color: "#06b6d4",
  },
  offer_received: {
    value: "offer_received",
    label: "Offer Received",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    color: "#f59e0b",
  },
  accepted: {
    value: "accepted",
    label: "Accepted",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    color: "#10b981",
  },
  rejected: {
    value: "rejected",
    label: "Rejected",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    color: "#f43f5e",
  },
  ghosted: {
    value: "ghosted",
    label: "Ghosted",
    badgeClass: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20 border-dashed",
    color: "#9ca3af",
  },
  withdrawn: {
    value: "withdrawn",
    label: "Withdrawn",
    badgeClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    color: "#71717a",
  },
};

export const STATUS_OPTIONS = Object.values(STATUS_CONFIG);
