import type { ApplicationStatus } from "./enums";

export interface StatusConfig {
  value: ApplicationStatus;
  label: string;
  /** Tailwind classes for the tinted-pill badge treatment. */
  badgeClass: string;
  /** Solid hex for charts / dots. */
  color: string;
  /** Whether to render a leading signal dot. */
  dot: boolean;
}

/**
 * Pill badges per the brief: ~10–15% opacity tinted background, a 1px border
 * of the same hue, small uppercase colored text. Five accent roles —
 * blue=Applied, purple=Screening/Assessment, amber=Interview,
 * green=Offer/Success, red=Rejected — plus neutral for inert states.
 */
export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  saved: {
    value: "saved",
    label: "Saved",
    badgeClass: "border-muted-foreground/25 bg-muted/50 text-muted-foreground",
    color: "#6B6B6B",
    dot: true,
  },
  applied: {
    value: "applied",
    label: "Applied",
    badgeClass:
      "border-[color:var(--signal-blue)]/30 bg-[color:var(--signal-blue)]/12 text-[color:var(--signal-blue)]",
    color: "#3B82F6",
    dot: true,
  },
  interview: {
    value: "interview",
    label: "Interview",
    badgeClass:
      "border-[color:var(--signal-amber)]/30 bg-[color:var(--signal-amber)]/12 text-[color:var(--signal-amber)]",
    color: "#F59E0B",
    dot: true,
  },
  offer_received: {
    value: "offer_received",
    label: "Offer",
    badgeClass:
      "border-[color:var(--signal-green)]/30 bg-[color:var(--signal-green)]/12 text-[color:var(--signal-green)]",
    color: "#22C55E",
    dot: true,
  },
  accepted: {
    value: "accepted",
    label: "Accepted",
    badgeClass:
      "border-[color:var(--signal-green)]/40 bg-[color:var(--signal-green)]/15 text-[color:var(--signal-green)]",
    color: "#22C55E",
    dot: true,
  },
  rejected: {
    value: "rejected",
    label: "Rejected",
    badgeClass:
      "border-[color:var(--signal-red)]/30 bg-[color:var(--signal-red)]/12 text-[color:var(--signal-red)]",
    color: "#EF4444",
    dot: true,
  },
  ghosted: {
    value: "ghosted",
    label: "Ghosted",
    badgeClass:
      "border-dashed border-muted-foreground/25 bg-transparent text-muted-foreground",
    color: "#6B6B6B",
    dot: false,
  },
  withdrawn: {
    value: "withdrawn",
    label: "Withdrawn",
    badgeClass: "border-muted-foreground/25 bg-muted/50 text-muted-foreground",
    color: "#6B6B6B",
    dot: false,
  },
};

export const STATUS_OPTIONS = Object.values(STATUS_CONFIG);
