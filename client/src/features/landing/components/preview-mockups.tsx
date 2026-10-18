import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A subtle browser-chrome frame around a preview. */
export function BrowserFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/5 ring-1 ring-black/5 dark:shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
        <span className="size-2.5 rounded-full bg-rose-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 h-4 flex-1 rounded bg-muted" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1a` }}
    >
      {label}
    </span>
  );
}

const ROWS = [
  { company: "Acme", role: "Backend Engineer", status: "Interview", color: "#8b5cf6" },
  { company: "Globex", role: "Platform Engineer", status: "Applied", color: "#3b82f6" },
  { company: "Initech", role: "Full-stack Dev", status: "Offer", color: "#f59e0b" },
  { company: "Umbrella", role: "SRE", status: "Rejected", color: "#f43f5e" },
];

export function ApplicationsPreview() {
  return (
    <div className="space-y-2.5">
      <div className="flex gap-2">
        <div className="h-7 flex-1 rounded-md border bg-background" />
        <div className="h-7 w-16 rounded-md border bg-muted/60" />
        <div className="h-7 w-16 rounded-md border bg-muted/60" />
      </div>
      <div className="overflow-hidden rounded-lg border">
        {ROWS.map((row, i) => (
          <div
            key={row.company}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-xs",
              i !== ROWS.length - 1 && "border-b",
            )}
          >
            <span className="h-4 w-1 rounded" style={{ backgroundColor: row.color }} />
            <span className="w-16 font-medium">{row.company}</span>
            <span className="flex-1 text-muted-foreground">{row.role}</span>
            <Pill label={row.status} color={row.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex-1">
      <div className="flex h-20 items-end">
        <div className="w-full rounded-t" style={{ height: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function DashboardPreview() {
  const stats = [
    { label: "Submitted", value: "42" },
    { label: "Interviews", value: "7" },
    { label: "Offers", value: "3" },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border p-2.5">
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
            <p className="font-heading text-lg font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-3">
        <p className="mb-2 text-[10px] text-muted-foreground">Recruitment funnel</p>
        <div className="flex items-end gap-2">
          <Bar value={90} color="#3b82f6" />
          <Bar value={55} color="#8b5cf6" />
          <Bar value={32} color="#f59e0b" />
          <Bar value={18} color="#10b981" />
        </div>
      </div>
    </div>
  );
}

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const EVENT_DAYS: Record<number, string> = { 9: "#8b5cf6", 15: "#3b82f6", 22: "#f59e0b" };

export function CalendarPreview() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-muted-foreground">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 28 }).map((_, i) => {
          const day = i + 1;
          const dot = EVENT_DAYS[day];
          return (
            <div
              key={day}
              className="flex aspect-square flex-col items-center justify-center rounded border text-[9px] text-muted-foreground"
            >
              {day}
              {dot && <span className="mt-0.5 size-1 rounded-full" style={{ backgroundColor: dot }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function previewFor(key: "applications" | "dashboard" | "calendar"): ReactNode {
  if (key === "applications") return <ApplicationsPreview />;
  if (key === "dashboard") return <DashboardPreview />;
  return <CalendarPreview />;
}

/* --- Analytics previews for the sticky showcase --- */

export function AnalyticsResponsePreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Response rate", value: "38%" },
          { label: "Interview rate", value: "21%" },
          { label: "Offer rate", value: "9%" },
          { label: "Avg. first reply", value: "6 days" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border p-2.5">
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
            <p className="font-heading text-base font-semibold">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsTrendPreview() {
  const points = [20, 35, 28, 48, 40, 62, 55];
  const max = Math.max(...points);
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${40 - (p / max) * 36}`)
    .join(" ");
  return (
    <div className="rounded-lg border p-3">
      <p className="mb-2 text-[10px] text-muted-foreground">Applications per week</p>
      <svg viewBox="0 0 100 40" className="h-24 w-full" preserveAspectRatio="none">
        <polyline points={d} fill="none" stroke="#8b5cf6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export function AnalyticsBreakdownPreview() {
  const rows = [
    { label: "LinkedIn", rate: 72 },
    { label: "Referral", rate: 54 },
    { label: "Career page", rate: 33 },
    { label: "Wellfound", rate: 21 },
  ];
  return (
    <div className="space-y-2.5 rounded-lg border p-3">
      <p className="text-[10px] text-muted-foreground">Response rate by platform</p>
      {rows.map((r) => (
        <div key={r.label} className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span>{r.label}</span>
            <span className="text-muted-foreground">{r.rate}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${r.rate}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* --- Tab previews --- */

export function ResumesTabPreview() {
  const items = [
    { label: "Backend v3", tag: "Default" },
    { label: "Platform-focused v2" },
    { label: "Generalist v1" },
  ];
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center justify-between rounded-lg border p-2.5 text-xs">
          <span className="font-medium">{it.label}</span>
          {it.tag && <Pill label={it.tag} color="#f59e0b" />}
        </div>
      ))}
    </div>
  );
}

export function OffersTabPreview() {
  const offers = [
    { company: "Acme", total: "₹24,00,000", best: true },
    { company: "Globex", total: "₹21,50,000" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {offers.map((o) => (
        <div
          key={o.company}
          className={cn("rounded-lg border p-3", o.best && "border-emerald-500/40 bg-emerald-500/5")}
        >
          <p className="text-xs font-medium">{o.company}</p>
          <p className="font-heading text-sm font-semibold">{o.total}</p>
          <p className="text-[10px] text-muted-foreground">total comp / yr</p>
        </div>
      ))}
    </div>
  );
}

export function RemindersTabPreview() {
  const tasks = [
    { title: "Follow up with Acme recruiter", due: "Today", overdue: true },
    { title: "Prep for Globex system design", due: "Tomorrow" },
    { title: "Send thank-you note", due: "Fri" },
  ];
  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <div key={t.title} className="flex items-center gap-2 rounded-lg border p-2.5 text-xs">
          <span className="size-3.5 rounded border" />
          <span className="flex-1">{t.title}</span>
          <span className={cn("text-[10px]", t.overdue ? "text-rose-500" : "text-muted-foreground")}>
            {t.due}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CsvTabPreview() {
  return (
    <div className="space-y-2 rounded-lg border p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-medium">applications.csv</span>
        <Pill label="Preview" color="#3b82f6" />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded border p-1.5">
          <p className="font-heading text-sm font-semibold">120</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="rounded border p-1.5">
          <p className="font-heading text-sm font-semibold text-emerald-500">116</p>
          <p className="text-[10px] text-muted-foreground">Valid</p>
        </div>
        <div className="rounded border p-1.5">
          <p className="font-heading text-sm font-semibold text-rose-500">4</p>
          <p className="text-[10px] text-muted-foreground">Errors</p>
        </div>
      </div>
    </div>
  );
}