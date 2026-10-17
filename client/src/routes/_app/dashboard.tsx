import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverview } from "@/features/analytics/hooks/use-analytics";
import { OverviewStats } from "@/features/analytics/components/overview-stats";
import { ConversionFunnel } from "@/features/analytics/components/conversion-funnel";
import { StatusDistribution } from "@/features/analytics/components/status-distribution";
import { UpcomingInterviews } from "@/features/analytics/components/upcoming-interviews";
import { WeeklyGoalCard } from "@/features/goals/components/weekly-goal-card";

export const Route = createFileRoute("/_app/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useOverview();

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Your job-search at a glance." />

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        loadingFallback={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        }
      >
        {data && (
          <div className="space-y-6">
            <OverviewStats data={data} />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ConversionFunnel data={data} />
              </div>
              <WeeklyGoalCard />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <StatusDistribution data={data} />
              <UpcomingInterviews items={data.upcomingInterviews} />
            </div>
          </div>
        )}
      </DataState>
    </div>
  );
}