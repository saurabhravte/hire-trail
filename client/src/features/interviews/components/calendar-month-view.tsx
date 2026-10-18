import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import { INTERVIEW_STATUS_CONFIG, ROUND_LABELS } from "@/constants/interview";
import { zonedDayKey, zonedTime } from "@/lib/datetime";
import type { Interview } from "../types";

interface Props {
  anchor: Date;
  interviews: Interview[];
  onSelect: (interview: Interview) => void;
  onDayClick: (dayKey: string) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarMonthView({ anchor, interviews, onSelect, onDayClick }: Props) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 }),
  });

  const byDay = new Map<string, Interview[]>();
  for (const iv of interviews) {
    const key = zonedDayKey(iv.startTime, iv.timezone);
    (byDay.get(key) ?? byDay.set(key, []).get(key)!).push(iv);
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const items = (byDay.get(key) ?? []).sort((a, b) =>
            a.startTime.localeCompare(b.startTime),
          );
          const inMonth = isSameMonth(day, anchor);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onDayClick(key)}
              className={cn(
                "min-h-24 border-b border-r p-1.5 text-left transition-colors last:border-r-0 hover:bg-muted/40 [&:nth-child(7n)]:border-r-0",
                !inMonth && "bg-muted/20 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-xs",
                  isToday(day) && "bg-primary font-semibold text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-1">
                {items.slice(0, 3).map((iv) => (
                  <button
                    key={iv.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(iv);
                    }}
                    className="flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[11px] hover:bg-muted"
                  >
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: INTERVIEW_STATUS_CONFIG[iv.status].dot }}
                    />
                    <span className="truncate">
                      {zonedTime(iv.startTime, iv.timezone)} {ROUND_LABELS[iv.roundType]}
                    </span>
                  </button>
                ))}
                {items.length > 3 && (
                  <p className="px-1 text-[10px] text-muted-foreground">+{items.length - 3} more</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}