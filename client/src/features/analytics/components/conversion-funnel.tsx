import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import type { AnalyticsOverview } from "../types";

const STAGES = [
  { key: "applied", label: "Applied", color: "#3b82f6" },
  { key: "interview", label: "Interview", color: "#8b5cf6" },
  { key: "offer", label: "Offer", color: "#f59e0b" },
  { key: "accepted", label: "Accepted", color: "#10b981" },
] as const;

export function ConversionFunnel({ data }: { data: AnalyticsOverview }) {
  const { funnel } = data;
  const max = Math.max(funnel.applied, 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recruitment funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {STAGES.map((stage) => {
          const value = funnel[stage.key];
          const widthPct = Math.max((value / max) * 100, value > 0 ? 6 : 0);
          const conversionPct = funnel.applied > 0 ? value / funnel.applied : 0;
          return (
            <div key={stage.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{stage.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {value} · {formatPercent(conversionPct)}
                </span>
              </div>
              <div className="h-7 overflow-hidden rounded-md bg-muted">
                <div
                  className="flex h-full items-center rounded-md transition-[width] duration-500"
                  style={{ width: `${widthPct}%`, backgroundColor: stage.color }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}