import { format, subDays, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarRange } from "lucide-react";
import type { AnalyticsRange } from "../types";

const fmt = (d: Date) => format(d, "yyyy-MM-dd");

const PRESETS: { label: string; range: () => AnalyticsRange }[] = [
  { label: "Last 30 days", range: () => ({ from: fmt(subDays(new Date(), 30)), to: fmt(new Date()) }) },
  { label: "Last 90 days", range: () => ({ from: fmt(subDays(new Date(), 90)), to: fmt(new Date()) }) },
  { label: "Last 12 months", range: () => ({ from: fmt(subMonths(new Date(), 12)), to: fmt(new Date()) }) },
  { label: "All time", range: () => ({}) },
];

interface Props {
  value: AnalyticsRange;
  onChange: (range: AnalyticsRange) => void;
}

export function DateRangeFilter({ value, onChange }: Props) {
  const label =
    value.from || value.to
      ? `${value.from ?? "start"} → ${value.to ?? "now"}`
      : "All time";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <CalendarRange className="size-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="xs"
              onClick={() => onChange(preset.range())}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">From</Label>
            <Input
              type="date"
              value={value.from ?? ""}
              onChange={(e) => onChange({ ...value, from: e.target.value || undefined })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">To</Label>
            <Input
              type="date"
              value={value.to ?? ""}
              onChange={(e) => onChange({ ...value, to: e.target.value || undefined })}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}