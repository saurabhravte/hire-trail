import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateTime } from "@/lib/format";
import { humanize } from "@/lib/format";
import type { UpcomingInterview } from "../types";

export function UpcomingInterviews({ items }: { items: UpcomingInterview[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Upcoming interviews</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            icon={<CalendarClock />}
            title="Nothing scheduled"
            description="Interviews you schedule will appear here."
          />
        ) : (
          <ul className="divide-y">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{humanize(it.roundType)} round</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(it.startTime)}</p>
                </div>
                {it.meetingLink && (
                  <a
                    href={it.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Join
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}