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
      color: STATUS_CONFIG[d.status]?.color ?? "#94a3b8",
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Status distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyState title="No applications yet" description="Add applications to see the breakdown." />
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    background: "var(--popover)",
                    fontSize: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
              {chartData.map((entry) => (
                <span key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name} ({entry.value})
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}