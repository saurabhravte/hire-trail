import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/format";
import type { StatusHistoryEntry } from "../types";

export function StatusHistoryTimeline({ entries }: { entries: StatusHistoryEntry[] }) {
  if (entries.length === 0) {
    return <EmptyState title="No status changes yet" />;
  }
  return (
    <ol className="relative space-y-4 border-l pl-5">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[1.4rem] top-1 size-2.5 rounded-full border-2 border-background bg-primary" />
          <div className="flex flex-wrap items-center gap-2">
            {entry.previousStatus && (
              <>
                <StatusBadge status={entry.previousStatus} />
                <span className="text-xs text-muted-foreground">→</span>
              </>
            )}
            <StatusBadge status={entry.newStatus} />
            <span className="text-xs text-muted-foreground">{formatDateTime(entry.changedAt)}</span>
          </div>
          {entry.note && <p className="mt-1 text-sm text-muted-foreground">{entry.note}</p>}
        </li>
      ))}
    </ol>
  );
}