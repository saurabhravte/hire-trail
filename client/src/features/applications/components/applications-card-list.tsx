import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/shared/status-badge";
import { STATUS_CONFIG } from "@/constants/status";
import { formatDate, formatMoney } from "@/lib/format";
import type { Application } from "../types";
import { ApplicationRowActions } from "./application-row-actions";

interface Props {
  applications: Application[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export function ApplicationsCardList({ applications, selected, onToggle }: Props) {
  const navigate = useNavigate();
  return (
    <div className="space-y-2.5">
      {applications.map((app) => (
        <Card
          key={app.id}
          size="sm"
          className="cursor-pointer border-l-4"
          style={{ borderLeftColor: STATUS_CONFIG[app.status].color }}
          onClick={() => navigate({ to: "/applications/$id", params: { id: app.id } })}
        >
          <CardContent className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(app.id)}
                    onCheckedChange={() => onToggle(app.id)}
                    aria-label={`Select ${app.role}`}
                    className="mt-0.5"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{app.companyName ?? "—"}</p>
                  <p className="truncate text-sm text-muted-foreground">{app.role}</p>
                </div>
              </div>
              <span onClick={(e) => e.stopPropagation()}>
                <ApplicationRowActions application={app} />
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <StatusBadge status={app.status} />
              {app.location && <span>{app.location}</span>}
              <span className="tabular-nums">
                {formatMoney(app.salaryMax ?? app.salaryMin, app.currency, app.payPeriod)}
              </span>
              <span>Applied {formatDate(app.appliedDate)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}