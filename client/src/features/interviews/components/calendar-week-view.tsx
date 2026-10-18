import { eachDayOfInterval, endOfWeek, format, isToday, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";
import { ROUND_LABELS } from "@/constants/interview";
import { zonedDayKey, zonedTime } from "@/lib/datetime";
import type { Interview } from "../types";
import { InterviewStatusBadge } from "./interview-status-badge";

interface Props {
  anchor: Date;
  interviews: Interview[];
  onSelect: (interview: Interview) => void;
}

export function CalendarWeekView({ anchor, interviews, onSelect }: Props) {
  const days = eachDayOfInterval({
    start: startOfWeek(anchor, { weekStartsOn: 1 }),
    end: endOfWeek(anchor, { weekStartsOn: 1 }),
  });

  const byDay = new Map<string, Interview[]>();
  for (const iv of interviews) {
    const key = zonedDayKey(iv.startTime, iv.timezone);
    (byDay.get(key) ?? byDay.set(key, []).get(key)!).push(iv);
  }

  return (
    <div className="grid gap-2 md:grid-cols-7">
      {days.map((day) => {
        const key = format(day, "yyyy-MM-dd");
        const items = (byDay.get(key) ?? []).sort((a, b) =>
          a.startTime.localeCompare(b.startTime),
        );
        return (
          <div key={key} className="rounded-xl border">
            <div
              className={cn(
                "border-b px-2 py-1.5 text-center text-xs font-medium",
                isToday(day) ? "bg-primary/10 text-primary" : "text-muted-foreground",
              )}
            >
              {format(day, "EEE d")}
            </div>
            <div className="space-y-1.5 p-1.5">
              {items.length === 0 ? (
                <p className="py-2 text-center text-[11px] text-muted-foreground">—</p>
              ) : (
                items.map((iv) => (
                  <button
                    key={iv.id}
                    type="button"
                    onClick={() => onSelect(iv)}
                    className="w-full rounded-lg border p-1.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <p className="text-xs font-medium">{zonedTime(iv.startTime, iv.timezone)}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {ROUND_LABELS[iv.roundType]}
                    </p>
                    <div className="mt-1">
                      <InterviewStatusBadge status={iv.status} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}