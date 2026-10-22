import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatPercent } from "@/lib/format";
import type { AnalyticsOverview } from "../types";

const STAGES = [
  { key: "applied", label: "Applied", color: "#3B82F6" },
  { key: "interview", label: "Interview", color: "#F59E0B" },
  { key: "offer", label: "Offer", color: "#22C55E" },
  { key: "accepted", label: "Accepted", color: "#A855F7" },
] as const;

/** Read a resolved CSS custom property / color from the document root. */
function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function ConversionFunnel({ data }: { data: AnalyticsOverview }) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  const { funnel } = data;
  const hasData = funnel.applied > 0;

  // Build Sankey nodes/links from the funnel counts.
  const option = useMemo<echarts.EChartsOption>(() => {
    const nodes = STAGES.map((s) => ({
      name: s.label,
      itemStyle: { color: s.color, borderColor: "transparent" },
    }));

    // Each link carries the count flowing into the next stage; only draw
    // positive flows so the diagram stays clean when later stages are empty.
    const flows: [keyof typeof funnel, keyof typeof funnel][] = [
      ["applied", "interview"],
      ["interview", "offer"],
      ["offer", "accepted"],
    ];
    const links = flows
      .map(([, to], i) => ({
        source: STAGES[i].label,
        target: STAGES[i + 1].label,
        value: Math.max(funnel[to], 0.0001), // keep a hairline even at 0
        realValue: funnel[to],
      }))
      .filter((l) => l.realValue >= 0);

    const mutedText = cssVar("--muted-foreground", "#A3A3A3");
    const fgText = cssVar("--foreground", "#FAFAFA");

    return {
      animationDuration: 500,
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
        backgroundColor: cssVar("--popover", "#1A1A1A"),
        borderColor: cssVar("--border", "#262626"),
        borderWidth: 1,
        textStyle: { color: fgText, fontSize: 12 },
        formatter: (p: unknown) => {
          const param = p as { dataType?: string; data?: { realValue?: number }; name?: string };
          if (param.dataType === "edge" && param.data?.realValue != null) {
            return `${param.data.realValue}`;
          }
          return param.name ?? "";
        },
      },
      series: [
        {
          type: "sankey",
          left: 8,
          right: 110, // room for the right-most node label
          top: 10,
          bottom: 10,
          nodeWidth: 14,
          nodeGap: 14,
          draggable: false,
          emphasis: { focus: "adjacency" },
          label: {
            color: fgText,
            fontSize: 12,
            fontWeight: 600,
            formatter: (p: unknown) => {
              const param = p as { name?: string; value?: number };
              const stage = STAGES.find((s) => s.label === param.name);
              const count = stage ? funnel[stage.key] : 0;
              return `{n|${param.name}}  {c|${count}}`;
            },
            rich: {
              n: { color: fgText, fontSize: 12, fontWeight: 600 },
              c: { color: mutedText, fontSize: 11, fontWeight: 600 },
            },
          },
          lineStyle: {
            color: "gradient",
            opacity: 0.35,
            curveness: 0.5,
          },
          itemStyle: { borderWidth: 0 },
          data: nodes,
          links,
        },
      ],
    };
  }, [funnel]);

  useEffect(() => {
    if (!ref.current || !hasData) return;
    const chart = echarts.init(ref.current, undefined, { renderer: "svg" });
    chartRef.current = chart;
    chart.setOption(option);

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);

    // Re-theme when light/dark toggles (class on <html> changes).
    const observer = new MutationObserver(() => chart.setOption(option));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [option, hasData]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Recruitment funnel</CardTitle>
        <span className="text-xs text-muted-foreground">
          {funnel.applied > 0
            ? `${formatPercent(funnel.accepted / funnel.applied)} end-to-end`
            : ""}
        </span>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <EmptyState
            title="No applications yet"
            description="Submit applications to see your funnel."
          />
        ) : (
          <div ref={ref} className="h-64 w-full" />
        )}
      </CardContent>
    </Card>
  );
}
