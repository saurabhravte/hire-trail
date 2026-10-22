import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useStreak } from "../hooks/use-streak";

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

/** Green intensity steps (brief's offer/success hue) by apply count. */
function levelClass(count: number): string {
  if (count <= 0) return "bg-muted/60";
  if (count === 1) return "bg-[color:var(--signal-green)]/30";
  if (count === 2) return "bg-[color:var(--signal-green)]/55";
  if (count <= 4) return "bg-[color:var(--signal-green)]/80";
  return "bg-[color:var(--signal-green)]";
}

export function StreakHeatmap() {
  const { data, isLoading } = useStreak();

  // Group days into week-columns (7 rows). Pad the first week so weekday
  // rows line up (Mon-first).
  const weeks = useMemo(() => {
    const cells = data?.heatmap ?? [];
    if (cells.length === 0) return [];
    const firstDow = (parseISO(cells[0].date).getDay() + 6) % 7; // Mon=0
    const padded = [
      ...Array.from({ length: firstDow }, () => null),
      ...cells,
    ];
    const cols: (null | { date: string; count: number })[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      cols.push(padded.slice(i, i + 7));
    }
    return cols;
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Apply activity</CardTitle>
        {data && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[color:var(--signal-amber)]">
            <Flame className="size-3.5" />
            {data.current} day streak
          </span>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {/* Weekday labels */}
              <div className="flex flex-col gap-[3px] pt-[2px]">
                {WEEKDAY_LABELS.map((d, i) => (
                  <span
                    key={i}
                    className="h-[11px] text-[9px] leading-[11px] text-muted-foreground"
                  >
                    {d}
                  </span>
                ))}
              </div>
              {/* Week columns */}
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((cell, di) =>
                    cell ? (
                      <Tooltip key={cell.date}>
                        <TooltipTrigger asChild>
                          <span
                            className={cn("size-[11px] rounded-[3px]", levelClass(cell.count))}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {cell.count} {cell.count === 1 ? "application" : "applications"} ·{" "}
                          {format(parseISO(cell.date), "d MMM yyyy")}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span key={`${wi}-${di}`} className="size-[11px]" />
                    ),
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Longest streak: {data?.longest ?? 0} days</span>
              <span className="flex items-center gap-1">
                Less
                <span className="size-[9px] rounded-[2px] bg-muted/60" />
                <span className="size-[9px] rounded-[2px] bg-[color:var(--signal-green)]/30" />
                <span className="size-[9px] rounded-[2px] bg-[color:var(--signal-green)]/55" />
                <span className="size-[9px] rounded-[2px] bg-[color:var(--signal-green)]/80" />
                <span className="size-[9px] rounded-[2px] bg-[color:var(--signal-green)]" />
                More
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
