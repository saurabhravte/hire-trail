import { Card, CardContent } from "@/components/ui/card";

interface Props {
  label: string;
  value: string;
  hint?: string;
}

export function MetricCard({ label, value, hint }: Props) {
  return (
    <Card size="sm">
      <CardContent className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}