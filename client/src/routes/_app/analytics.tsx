import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversionFunnel } from "@/features/analytics/components/conversion-funnel";
import { StatusDistribution } from "@/features/analytics/components/status-distribution";
import { DateRangeFilter } from "@/features/analytics/components/date-range-filter";
import { ConversionMetrics } from "@/features/analytics/components/conversion-metrics";
import { BreakdownTable } from "@/features/analytics/components/breakdown-table";
import { ActivityChart } from "@/features/analytics/components/activity-chart";
import {
  useActivity,
  useBreakdowns,
  useConversion,
  useOverview,
} from "@/features/analytics/hooks/use-analytics";
import type { ActivityGroupBy, AnalyticsRange } from "@/features/analytics/types";

export const Route = createFileRoute("/_app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>({});
  const [groupBy, setGroupBy] = useState<ActivityGroupBy>("week");

  const overview = useOverview(range);
  const conversion = useConversion(range);
  const breakdowns = useBreakdowns(range);
  const activity = useActivity(range, groupBy);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Understand what's working across your job search."
        actions={<DateRangeFilter value={range} onChange={setRange} />}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Conversion</h2>
        <DataState
          isLoading={conversion.isLoading}
          isError={conversion.isError}
          error={conversion.error}
          onRetry={conversion.refetch}
          loadingFallback={
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          }
        >
          {conversion.data && <ConversionMetrics data={conversion.data} />}
        </DataState>
      </section>

      <DataState
        isLoading={activity.isLoading}
        isError={activity.isError}
        error={activity.error}
        onRetry={activity.refetch}
        loadingFallback={<Skeleton className="h-80 w-full rounded-xl" />}
      >
        {activity.data && (
          <ActivityChart data={activity.data} groupBy={groupBy} onGroupByChange={setGroupBy} />
        )}
      </DataState>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataState
            isLoading={overview.isLoading}
            isError={overview.isError}
            error={overview.error}
            onRetry={overview.refetch}
            loadingFallback={<Skeleton className="h-72 w-full rounded-xl" />}
          >
            {overview.data && <ConversionFunnel data={overview.data} />}
          </DataState>
        </div>
        <DataState
          isLoading={overview.isLoading}
          isError={overview.isError}
          onRetry={overview.refetch}
          loadingFallback={<Skeleton className="h-72 w-full rounded-xl" />}
        >
          {overview.data && <StatusDistribution data={overview.data} />}
        </DataState>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Performance breakdowns</h2>
        <DataState
          isLoading={breakdowns.isLoading}
          isError={breakdowns.isError}
          error={breakdowns.error}
          onRetry={breakdowns.refetch}
          loadingFallback={
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          }
        >
          {breakdowns.data && (
            <div className="grid gap-4 lg:grid-cols-2">
              <BreakdownTable title="By platform" dimensionLabel="Platform" rows={breakdowns.data.byPlatform} />
              <BreakdownTable title="By resume version" dimensionLabel="Resume" rows={breakdowns.data.byResume} />
              <BreakdownTable title="By role" dimensionLabel="Role" rows={breakdowns.data.byRole} />
              <BreakdownTable title="By tech stack" dimensionLabel="Tech" rows={breakdowns.data.byTechStack} />
            </div>
          )}
        </DataState>
      </section>
    </div>
  );
}