import { CheckCircle2, Send, Sparkles, Ghost, XCircle, CalendarClock } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { AnalyticsOverview } from "../types";

export function OverviewStats({ data }: { data: AnalyticsOverview }) {
  const { totals, upcomingInterviewsCount, overdueTasksCount } = data;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Submitted" value={totals.submitted} icon={Send} />
      <StatCard label="Active" value={totals.active} icon={Sparkles} />
      <StatCard
        label="Interviews"
        value={upcomingInterviewsCount}
        icon={CalendarClock}
        accentClass="bg-violet-500/10 text-violet-500"
        hint="upcoming"
      />
      <StatCard
        label="Offers"
        value={totals.offersReceived}
        icon={CheckCircle2}
        accentClass="bg-amber-500/10 text-amber-500"
      />
      <StatCard
        label="Rejections"
        value={totals.rejections}
        icon={XCircle}
        accentClass="bg-rose-500/10 text-rose-500"
      />
      <StatCard
        label="Ghosted"
        value={totals.ghosted}
        icon={Ghost}
        hint={overdueTasksCount ? `${overdueTasksCount} tasks overdue` : undefined}
      />
    </div>
  );
}