import { format, parseISO } from "date-fns";
import { EmptyState } from "@/components/shared/empty-state";
import { zonedDayKey } from "@/lib/datetime";
import type { Interview } from "../types";
import { InterviewCard } from "./interview-card";

interface Props {
  interviews: Interview[];
  onSelect: (interview: Interview) => void;
}

export function CalendarAgendaView({ interviews, onSelect }: Props) {
  if (interviews.length === 0) {
    return <EmptyState title="No interviews" description="Scheduled interviews appear here." />;
  }

  const sorted = [...interviews].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const groups = new Map<string, Interview[]>();
  for (const iv of sorted) {
    const key = zonedDayKey(iv.startTime, iv.timezone);
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(iv);
  }

  return (
    <div className="space-y-5">
      {[...groups.entries()].map(([dayKey, items]) => (
        <div key={dayKey} className="space-y-2">
          <h3 className="sticky top-14 z-[1] bg-background/80 py-1 text-sm font-medium backdrop-blur">
            {format(parseISO(dayKey), "EEEE, d MMMM yyyy")}
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {items.map((iv) => (
              <InterviewCard key={iv.id} interview={iv} onEdit={onSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}