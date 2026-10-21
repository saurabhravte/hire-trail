import { useMemo } from "react";
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
import { WelcomeCard } from "@/features/dashboard/components/welcome-card";

export const Route = createFileRoute("/_app/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useOverview();

  const contextLine = useMemo(() => {
    if (!data) return undefined;
    const iv = data.upcomingInterviewsCount;
    if (iv > 0) return `You have ${iv} interview${iv === 1 ? "" : "s"} coming up.`;
    const active = data.totals.active;
    if (active > 0) return `${active} application${active === 1 ? "" : "s"} in progress — keep going.`;
    return undefined;
  }, [data]);

  return (
    <div className="space-y-6">
      <WelcomeCard contextLine={contextLine} />

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