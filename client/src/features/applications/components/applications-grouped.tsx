import { useNavigate } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import type { CompanyGroup } from "../types";

export function ApplicationsGrouped({ groups }: { groups: CompanyGroup[] }) {
  const navigate = useNavigate();
  return (
    <Accordion
      type="multiple"
      defaultValue={groups.slice(0, 3).map((g) => g.companyId ?? "none")}
      className="rounded-xl border px-3"
    >
      {groups.map((group) => (
        <AccordionItem key={group.companyId ?? "none"} value={group.companyId ?? "none"}>
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              <span className="font-medium">{group.companyName}</span>
              <Badge variant="secondary" className="h-5">
                {group.count}
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="divide-y">
              {group.applications.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 py-2.5 text-left hover:text-foreground"
                    onClick={() => navigate({ to: "/applications/$id", params: { id: app.id } })}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{app.role}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied {formatDate(app.appliedDate)} ·{" "}
                        {formatMoney(app.salaryMax ?? app.salaryMin, app.currency, app.payPeriod)}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}