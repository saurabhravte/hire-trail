import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { STATUS_CONFIG } from "@/constants/status";
import { humanize } from "@/lib/format";
import type { AnalyticsOverview } from "../types";

export function StatusDistribution({ data }: { data: AnalyticsOverview }) {
  const chartData = data.statusDistribution
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: STATUS_CONFIG[d.status]?.label ?? humanize(d.status),
      value: d.count,
      color: STATUS_CONFIG[d.status]?.color ?? "#6B6B6B",
    }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Status distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Add applications to see the breakdown."
          />
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Chart: extra height + inner radius so slices don't crowd;
                stroke set to the card color makes a clean divider in both modes. */}
            <div className="h-56 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                      background: "var(--popover)",
                      color: "var(--popover-foreground)",
                      fontSize: "0.75rem",
                    }}
                    formatter={(value, name) => {
                      const v = Number(value ?? 0);
                      return [`${v} (${Math.round((v / total) * 100)}%)`, String(name)];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend as a readable list — no cramped on-arc labels to overlap. */}
            <ul className="flex-1 space-y-1.5">
              {chartData.map((entry) => (
                <li
                  key={entry.name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate">{entry.name}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {entry.value}
                    <span className="ml-1 opacity-70">
                      {Math.round((entry.value / total) * 100)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
