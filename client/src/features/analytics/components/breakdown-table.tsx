import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPercent } from "@/lib/format";
import type { BreakdownRow } from "../types";

interface Props {
  title: string;
  rows: BreakdownRow[];
  dimensionLabel: string;
}

export function BreakdownTable({ title, rows, dimensionLabel }: Props) {
  const withData = rows.filter((r) => r.submitted > 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {withData.length === 0 ? (
          <EmptyState title="No data in this range" />
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>{dimensionLabel}</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                  <TableHead className="text-right">Responded</TableHead>
                  <TableHead className="text-right">Response rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withData.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.submitted}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.responded}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPercent(row.responseRate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}