import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  /** Accent for the status dot / icon tint. */
  accent?: "emerald" | "cyan" | "amber" | "crimson" | "neutral";
  accentClass?: string;
}

const DOT: Record<NonNullable<StatCardProps["accent"]>, string> = {
  emerald: "bg-[color:var(--signal-emerald)]",
  cyan: "bg-[color:var(--signal-cyan)]",
  amber: "bg-[color:var(--signal-amber)]",
  crimson: "bg-[color:var(--signal-crimson)]",
  neutral: "bg-muted-foreground",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "neutral",
  accentClass,
}: StatCardProps) {
  return (
    <Card size="sm" className="rounded-sm">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="label-mono">{label}</span>
          <span className={cn("size-2 rounded-full", DOT[accent])} />
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
              {value}
            </p>
            {hint && (
              <p className="font-mono text-[11px] text-muted-foreground">
                {hint}
              </p>
            )}
          </div>
          {Icon && (
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-sm border border-border bg-muted/40 text-muted-foreground [&_svg]:size-4",
                accentClass,
              )}
            >
              <Icon />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
