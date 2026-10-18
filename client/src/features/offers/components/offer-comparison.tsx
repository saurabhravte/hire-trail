import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataState } from "@/components/shared/data-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDate, formatMoney, humanize } from "@/lib/format";
import { useCompareOffers } from "../hooks/use-offers";
import { OfferDecisionBadge } from "./offer-decision-badge";
import type { Offer } from "../types";

function total(o: Offer): number {
  return (o.basePay ?? 0) + (o.variablePay ?? 0) + (o.bonus ?? 0);
}

export function OfferComparison({ ids }: { ids: string[] }) {
  const { data, isLoading, isError, error, refetch } = useCompareOffers(ids);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Compare offers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DataState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
          {data && (
            <>
              {!data.comparable && (
                <Alert variant="destructive">
                  <AlertTriangle />
                  <AlertTitle>Mixed currencies or pay periods</AlertTitle>
                  <AlertDescription>
                    These offers use different currencies or compensation periods, so totals aren’t
                    directly comparable. Values are shown as entered.
                  </AlertDescription>
                </Alert>
              )}
              <ComparisonTable offers={data.offers} comparable={data.comparable} />
            </>
          )}
        </DataState>
      </CardContent>
    </Card>
  );
}

function ComparisonTable({ offers, comparable }: { offers: Offer[]; comparable: boolean }) {
  const bestTotal = comparable ? Math.max(...offers.map(total)) : null;

  const rows: { label: string; render: (o: Offer) => React.ReactNode; highlightBest?: boolean }[] = [
    { label: "Role", render: (o) => o.role ?? "—" },
    { label: "Base pay", render: (o) => formatMoney(o.basePay, o.currency, o.payPeriod) },
    { label: "Variable", render: (o) => formatMoney(o.variablePay, o.currency, o.payPeriod) },
    { label: "Bonus", render: (o) => formatMoney(o.bonus, o.currency, o.payPeriod) },
    {
      label: "Total comp",
      highlightBest: true,
      render: (o) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(total(o), o.currency, o.payPeriod)}
        </span>
      ),
    },
    { label: "Currency", render: (o) => o.currency ?? "—" },
    { label: "Period", render: (o) => (o.payPeriod ? humanize(o.payPeriod) : "—") },
    { label: "Work mode", render: (o) => (o.workMode ? humanize(o.workMode) : "—") },
    { label: "Location", render: (o) => o.location ?? "—" },
    { label: "Joining", render: (o) => formatDate(o.joiningDate) },
    { label: "Deadline", render: (o) => formatDate(o.deadline) },
    { label: "Equity", render: (o) => o.equityNotes ?? "—" },
    { label: "Benefits", render: (o) => o.benefits ?? "—" },
    { label: "Decision", render: (o) => <OfferDecisionBadge decision={o.decision} /> },
  ];

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-32" />
            {offers.map((o) => (
              <TableHead key={o.id} className="font-medium text-foreground">
                {o.companyName ?? "—"}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium text-muted-foreground">{row.label}</TableCell>
              {offers.map((o) => {
                const isBest = row.highlightBest && bestTotal != null && total(o) === bestTotal;
                return (
                  <TableCell
                    key={o.id}
                    className={cn(
                      "align-top whitespace-normal",
                      isBest && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                    )}
                  >
                    {row.render(o)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}