import { EmptyState } from "@/components/shared/empty-state";
import { formatRelative, humanize } from "@/lib/format";
import type { ActivityEntry } from "../types";

const LABELS: Record<string, string> = {
  created: "Application created",
  updated: "Details updated",
  note_edited: "Notes edited",
  status_changed: "Status changed",
  archived: "Archived",
  restored: "Restored",
  interview_scheduled: "Interview scheduled",
  interview_rescheduled: "Interview rescheduled",
  interview_cancelled: "Interview cancelled",
  interview_outcome: "Interview outcome recorded",
  task_created: "Follow-up created",
  task_completed: "Follow-up completed",
};

export function ActivityTimeline({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return <EmptyState title="No activity yet" />;
  }
  return (
    <ol className="relative space-y-4 border-l pl-5">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[1.4rem] top-1 size-2.5 rounded-full border-2 border-background bg-muted-foreground/40" />
          <p className="text-sm font-medium">{LABELS[entry.eventType] ?? humanize(entry.eventType)}</p>
          <p className="text-xs text-muted-foreground">{formatRelative(entry.createdAt)}</p>
        </li>
      ))}
    </ol>
  );
}