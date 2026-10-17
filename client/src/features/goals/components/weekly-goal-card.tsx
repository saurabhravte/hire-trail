import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCurrentGoal } from "../hooks/use-goals";

export function WeeklyGoalCard() {
  const { data } = useCurrentGoal();

  const target = data?.targetCount ?? 0;
  const submitted = data?.submittedCount ?? 0;
  const pct = Math.round((data?.progress ?? 0) * 100);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Target className="size-4 text-emerald-500" />
          Weekly goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!data?.hasGoal ? (
          <p className="text-sm text-muted-foreground">
            No goal set this week. Add one in Settings to track progress.
          </p>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-2xl font-semibold tabular-nums">
                {submitted}
                <span className="text-base font-normal text-muted-foreground"> / {target}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {data.isPaused ? "Paused" : `${data.remaining} to go`}
              </span>
            </div>
            <Progress value={pct} />
          </>
        )}
      </CardContent>
    </Card>
  );
}