import type { ApplicationStatus } from "./enums";

export interface StatusConfig {
  value: ApplicationStatus;
  label: string;
  /** Tailwind classes for the outline badge treatment. */
  badgeClass: string;
  /** Solid hex for charts / dots. */
  color: string;
  /** Whether to render a leading signal dot. */
  dot: boolean;
}

/**
 * Terminal "instrument LED" status treatment: solid surface base, 1px
 * accent border at ~30% opacity, text in the signal color, optional
 * leading dot. Uses the four signal roles only (emerald/cyan/amber/
 * crimson) plus neutral zinc for inert states.
 */
export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  saved: {
    value: "saved",
    label: "Saved",
    badgeClass:
      "border-muted-foreground/25 bg-muted/40 text-muted-foreground",
    color: "#71717a",
    dot: true,
  },
  applied: {
    value: "applied",
    label: "Applied",
    badgeClass:
      "border-muted-foreground/25 bg-muted/40 text-muted-foreground",
    color: "#a1a1aa",
    dot: true,
  },
  interview: {
    value: "interview",
    label: "Interview",
    badgeClass:
      "border-[color:var(--signal-cyan)]/30 bg-[color:var(--signal-cyan)]/10 text-[color:var(--signal-cyan)]",
    color: "#06b6d4",
    dot: true,
  },
  offer_received: {
    value: "offer_received",
    label: "Offer Received",
    badgeClass:
      "border-[color:var(--signal-amber)]/30 bg-[color:var(--signal-amber)]/10 text-[color:var(--signal-amber)]",
    color: "#f97316",
    dot: true,
  },
  accepted: {
    value: "accepted",
    label: "Accepted",
    badgeClass:
      "border-[color:var(--signal-emerald)]/30 bg-[color:var(--signal-emerald)]/10 text-[color:var(--signal-emerald)]",
    color: "#10b981",
    dot: true,
  },
  rejected: {
    value: "rejected",
    label: "Rejected",
    badgeClass:
      "border-[color:var(--signal-crimson)]/30 bg-[color:var(--signal-crimson)]/10 text-[color:var(--signal-crimson)]",
    color: "#ef4444",
    dot: true,
  },
  ghosted: {
    value: "ghosted",
    label: "Ghosted",
    badgeClass:
      "border-dashed border-muted-foreground/25 bg-transparent text-muted-foreground",
    color: "#71717a",
    dot: false,
  },
  withdrawn: {
    value: "withdrawn",
    label: "Withdrawn",
    badgeClass:
      "border-muted-foreground/25 bg-muted/40 text-muted-foreground",
    color: "#71717a",
    dot: false,
  },
};

export const STATUS_OPTIONS = Object.values(STATUS_CONFIG);
