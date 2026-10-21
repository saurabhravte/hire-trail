import { useEffect, useState } from "react";
import { Filter, LayoutGrid, Table2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDebounce } from "@/hooks/use-debounce";
import { humanize } from "@/lib/format";
import {
  PRIORITIES,
  WORK_MODES,
  type ApplicationStatus,
  type Priority,
  type WorkMode,
} from "@/constants/enums";
import { STATUS_OPTIONS } from "@/constants/status";
import { usePlatforms } from "@/features/platforms/hooks/use-platforms";
import { MultiSelectFilter } from "./multi-select-filter";
import type { ApplicationListParams } from "../types";

export interface FiltersValue extends ApplicationListParams {
  view: "table" | "grouped";
}

interface Props {
  value: FiltersValue;
  onChange: (patch: Partial<FiltersValue>) => void;
  onClear: () => void;
}

export function ApplicationsFilters({ value, onChange, onClear }: Props) {
  const { data: platforms } = usePlatforms();

  // Local search state so typing feels instant; commit (debounced) to URL.
  const [search, setSearch] = useState(value.q ?? "");
  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    if ((value.q ?? "") !== debouncedSearch) {
      onChange({ q: debouncedSearch || undefined, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync the input when the URL changes from outside (e.g. "Clear all"), without clobbering typing.
  const [prevQ, setPrevQ] = useState(value.q);
  if (value.q !== prevQ) {
    setPrevQ(value.q);
    if ((value.q ?? "") !== debouncedSearch) setSearch(value.q ?? "");
  }

  const activeChips = buildChips(value, platforms?.map((p) => ({ id: p.id, name: p.name })) ?? []);
  const hasFilters = activeChips.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, role, notes…"
            className="pr-8"
            aria-label="Search applications"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <MultiSelectFilter
          label="Status"
          options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
          selected={value.status ?? []}
          onChange={(v) => onChange({ status: v as ApplicationStatus[], page: 1 })}
        />
        <MultiSelectFilter
          label="Work mode"
          options={WORK_MODES.map((m) => ({ value: m, label: humanize(m) }))}
          selected={value.workMode ?? []}
          onChange={(v) => onChange({ workMode: v as WorkMode[], page: 1 })}
        />
        <MultiSelectFilter
          label="Priority"
          options={PRIORITIES.map((p) => ({ value: p, label: humanize(p) }))}
          selected={value.priority ?? []}
          onChange={(v) => onChange({ priority: v as Priority[], page: 1 })}
        />
        {platforms && platforms.length > 0 && (
          <MultiSelectFilter
            label="Platform"
            searchable
            options={platforms.map((p) => ({ value: p.id, label: p.name }))}
            selected={value.platformId ?? []}
            onChange={(v) => onChange({ platformId: v, page: 1 })}
          />
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="size-3.5" /> More
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Location</Label>
              <Input
                value={value.location ?? ""}
                onChange={(e) => onChange({ location: e.target.value || undefined, page: 1 })}
                placeholder="e.g. Remote, Bengaluru"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tech stack (comma-separated)</Label>
              <Input
                defaultValue={(value.techStack ?? []).join(", ")}
                onBlur={(e) =>
                  onChange({
                    techStack: e.target.value
                      ? e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                      : undefined,
                    page: 1,
                  })
                }
                placeholder="React, Node"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Applied from</Label>
                <Input
                  type="date"
                  value={value.appliedFrom ?? ""}
                  onChange={(e) => onChange({ appliedFrom: e.target.value || undefined, page: 1 })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Applied to</Label>
                <Input
                  type="date"
                  value={value.appliedTo ?? ""}
                  onChange={(e) => onChange({ appliedTo: e.target.value || undefined, page: 1 })}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        <ToggleGroup
          type="single"
          value={value.archived ?? "false"}
          onValueChange={(v) =>
            v && onChange({ archived: v as "true" | "false" | "all", page: 1 })
          }
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="false">Active</ToggleGroupItem>
          <ToggleGroupItem value="true">Archived</ToggleGroupItem>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="single"
          value={value.view}
          onValueChange={(v) => v && onChange({ view: v as "table" | "grouped" })}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="table" aria-label="Table view">
            <Table2 className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grouped" aria-label="Grouped by company">
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeChips.map((chip) => (
            <Badge key={chip.key} variant="secondary" className="gap-1">
              {chip.label}
              <button
                type="button"
                onClick={() => onChange({ ...chip.clear, page: 1 })}
                aria-label={`Remove ${chip.label}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="xs" onClick={onClear}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

function buildChips(
  v: FiltersValue,
  platforms: { id: string; name: string }[],
): { key: string; label: string; clear: Partial<FiltersValue> }[] {
  const chips: { key: string; label: string; clear: Partial<FiltersValue> }[] = [];
  if (v.q) chips.push({ key: "q", label: `“${v.q}”`, clear: { q: undefined } });
  for (const s of v.status ?? [])
    chips.push({
      key: `status-${s}`,
      label: humanize(s),
      clear: { status: (v.status ?? []).filter((x) => x !== s) },
    });
  for (const m of v.workMode ?? [])
    chips.push({
      key: `wm-${m}`,
      label: humanize(m),
      clear: { workMode: (v.workMode ?? []).filter((x) => x !== m) },
    });
  for (const p of v.priority ?? [])
    chips.push({
      key: `pri-${p}`,
      label: humanize(p),
      clear: { priority: (v.priority ?? []).filter((x) => x !== p) },
    });
  for (const id of v.platformId ?? [])
    chips.push({
      key: `plat-${id}`,
      label: platforms.find((p) => p.id === id)?.name ?? "Platform",
      clear: { platformId: (v.platformId ?? []).filter((x) => x !== id) },
    });
  for (const t of v.techStack ?? [])
    chips.push({
      key: `tech-${t}`,
      label: t,
      clear: { techStack: (v.techStack ?? []).filter((x) => x !== t) },
    });
  if (v.location) chips.push({ key: "loc", label: v.location, clear: { location: undefined } });
  if (v.appliedFrom)
    chips.push({ key: "from", label: `From ${v.appliedFrom}`, clear: { appliedFrom: undefined } });
  if (v.appliedTo)
    chips.push({ key: "to", label: `To ${v.appliedTo}`, clear: { appliedTo: undefined } });
  return chips;
}