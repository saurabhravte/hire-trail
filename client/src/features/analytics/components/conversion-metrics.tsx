import { formatPercent } from "@/lib/format";
import { MetricCard } from "./metric-card";
import type { AnalyticsConversion } from "../types";

function days(metric: AnalyticsConversion["avgDaysToFirstResponse"]): string {
  return metric.value == null ? "—" : `${metric.value} days`;
}

export function ConversionMetrics({ data }: { data: AnalyticsConversion }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      <MetricCard
        label="Response rate"
        value={formatPercent(data.responseRate)}
        hint={`${data.responded} of ${data.submitted} submitted`}
      />
      <MetricCard
        label="Interview conversion"
        value={formatPercent(data.interviewConversion)}
        hint={`${data.reachedInterview} reached interview`}
      />
      <MetricCard
        label="Offer rate"
        value={formatPercent(data.offerRate)}
        hint={`${data.offersReceived} offers`}
      />
      <MetricCard
        label="Acceptance rate"
        value={formatPercent(data.acceptanceRate)}
        hint={`${data.offersAccepted} of ${data.offersReceived} offers`}
      />
      <MetricCard
        label="Avg. days to first response"
        value={days(data.avgDaysToFirstResponse)}
        hint={`n = ${data.avgDaysToFirstResponse.sampleSize}`}
      />
      <MetricCard
        label="Avg. days to interview"
        value={days(data.avgDaysToInterview)}
        hint={`n = ${data.avgDaysToInterview.sampleSize}`}
      />
      <MetricCard label="Submitted" value={String(data.submitted)} hint="excludes saved" />
      <MetricCard label="Offers accepted" value={String(data.offersAccepted)} />
    </div>
  );
}