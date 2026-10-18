export interface NavLink {
  label: string;
  id: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Features", id: "features" },
  { label: "How it works", id: "how" },
  { label: "Analytics", id: "analytics" },
  { label: "More", id: "more" },
];

export type PreviewKey = "applications" | "dashboard" | "calendar";

export interface FeatureRowData {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  preview: PreviewKey;
  accent: string; // text color class for the eyebrow/icon
}

export const FEATURE_ROWS: FeatureRowData[] = [
  {
    eyebrow: "Applications workspace",
    title: "Every application in one fast table",
    description:
      "Search as you type, stack filters, sort any column, and act in bulk — all server-backed so it stays quick no matter how many roles you track.",
    points: [
      "Debounced search across company, role, and notes",
      "Filter by status, platform, work mode, priority, tech, and dates",
      "Bulk archive or delete, plus grouping by company",
    ],
    preview: "applications",
    accent: "text-blue-500",
  },
  {
    eyebrow: "Dashboard",
    title: "See your whole search at a glance",
    description:
      "Submitted, active, interviews, offers — the numbers that matter, with a recruitment funnel and weekly goal so you always know where you stand.",
    points: [
      "KPI cards with saved jobs excluded from submitted counts",
      "Applied → Interview → Offer → Accepted funnel",
      "Weekly goal progress and upcoming interviews",
    ],
    preview: "dashboard",
    accent: "text-violet-500",
  },
  {
    eyebrow: "Interviews & calendar",
    title: "Never miss a round again",
    description:
      "Schedule interviews against any application with the right timezone, see them in month, week, or agenda views, and get in-app reminders.",
    points: [
      "Month, week, and agenda calendar views",
      "Rounds, interviewer, meeting link, and prep notes",
      "Times stored in UTC, shown in your timezone",
    ],
    preview: "calendar",
    accent: "text-emerald-500",
  },
];

export interface JourneyStep {
  status: string;
  title: string;
  description: string;
  color: string;
}

export const JOURNEY: JourneyStep[] = [
  {
    status: "Saved",
    title: "Capture roles instantly",
    description: "Quick-add a company, role, and link. Saved jobs stay out of your submitted stats until you apply.",
    color: "#64748b",
  },
  {
    status: "Applied",
    title: "Track every submission",
    description: "Record the platform, resume version, and date. Status history starts building automatically.",
    color: "#3b82f6",
  },
  {
    status: "Interview",
    title: "Prepare and show up",
    description: "Schedule rounds, store questions and prep notes, and get reminders before each one.",
    color: "#8b5cf6",
  },
  {
    status: "Offer",
    title: "Compare side by side",
    description: "Log compensation with its own currency and period, then compare offers without misleading math.",
    color: "#f59e0b",
  },
  {
    status: "Accepted",
    title: "Close it out",
    description: "Mark the outcome, keep the full timeline, and review what worked for next time.",
    color: "#10b981",
  },
];

export interface TabFeature {
  value: string;
  label: string;
  title: string;
  description: string;
}

export const TAB_FEATURES: TabFeature[] = [
  {
    value: "resumes",
    label: "Resumes",
    title: "Version every resume",
    description:
      "Keep multiple resume versions with private storage and short-lived download links, and record which one you used for each application.",
  },
  {
    value: "offers",
    label: "Offers",
    title: "Compare offers honestly",
    description:
      "Base, variable, bonus, equity, and benefits — compared side by side, with clear warnings when currencies or pay periods differ.",
  },
  {
    value: "reminders",
    label: "Reminders",
    title: "Stay on top of follow-ups",
    description:
      "Create follow-up tasks with due dates, see what's upcoming or overdue, and get de-duplicated in-app reminders.",
  },
  {
    value: "csv",
    label: "Import / Export",
    title: "Bring your data in and out",
    description:
      "Import from CSV with a validated preview and duplicate detection before anything saves, and export your applications or full account anytime.",
  },
];