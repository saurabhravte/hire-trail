import { useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { STATUS_CONFIG } from "@/constants/status";
import { formatDate, formatMoney, humanize } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Application, SortField } from "../types";
import { ApplicationRowActions } from "./application-row-actions";

interface Props {
  applications: Application[];
  sort: SortField;
  dir: "asc" | "desc";
  onSort: (field: SortField) => void;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
}

interface Column {
  key: string;
  label: string;
  sortField?: SortField;
  className?: string;
}

const COLUMNS: Column[] = [
  { key: "company", label: "Company", sortField: "company" },
  { key: "role", label: "Role", sortField: "role" },
  { key: "status", label: "Status", sortField: "status" },
  { key: "salary", label: "Salary", sortField: "salary" },
  { key: "location", label: "Location" },
  { key: "appliedDate", label: "Applied", sortField: "appliedDate" },
  { key: "priority", label: "Priority", sortField: "priority" },
  { key: "updatedAt", label: "Updated", sortField: "updatedAt" },
];

export function ApplicationsTable({
  applications,
  sort,
  dir,
  onSort,
  selected,
  onToggle,
  onToggleAll,
}: Props) {
  const navigate = useNavigate();
  const allSelected = applications.length > 0 && applications.every((a) => selected.has(a.id));
  const someSelected = applications.some((a) => selected.has(a.id));

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={(c) => onToggleAll(c === true)}
                aria-label="Select all on page"
              />
            </TableHead>
            {COLUMNS.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.sortField ? (
                  <button
                    type="button"
                    onClick={() => onSort(col.sortField!)}
                    className="flex items-center gap-1 font-medium hover:text-foreground"
                  >
                    {col.label}
                    <SortIcon active={sort === col.sortField} dir={dir} />
                  </button>
                ) : (
                  col.label
                )}
              </TableHead>
            ))}
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow
              key={app.id}
              data-state={selected.has(app.id) ? "selected" : undefined}
              className="cursor-pointer"
              onClick={() => navigate({ to: "/applications/$id", params: { id: app.id } })}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selected.has(app.id)}
                  onCheckedChange={() => onToggle(app.id)}
                  aria-label={`Select ${app.role}`}
                />
              </TableCell>
              <TableCell className="relative font-medium">
                <span
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ backgroundColor: STATUS_CONFIG[app.status].color }}
                  aria-hidden
                />
                {app.companyName ?? "—"}
              </TableCell>
              <TableCell>{app.role}</TableCell>
              <TableCell>
                <StatusBadge status={app.status} />
              </TableCell>
              <TableCell className="tabular-nums">
                {formatMoney(app.salaryMax ?? app.salaryMin, app.currency, app.payPeriod)}
              </TableCell>
              <TableCell className="text-muted-foreground">{app.location ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(app.appliedDate)}</TableCell>
              <TableCell>
                {app.priority !== "normal" ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      app.priority === "dream"
                        ? "border-amber-500/30 text-amber-600 dark:text-amber-400"
                        : "border-blue-500/30 text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {humanize(app.priority)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(app.updatedAt)}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <ApplicationRowActions application={app} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ChevronsUpDown className="size-3.5 text-muted-foreground/60" />;
  return dir === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />;
}