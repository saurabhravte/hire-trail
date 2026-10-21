import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { DataState } from "@/components/shared/data-state";
import { useCurrentGoal, useUpsertGoal } from "@/features/goals/hooks/use-goals";

export function WeeklyGoalSettings() {
  const { data, isLoading, isError, error, refetch } = useCurrentGoal();
  const upsert = useUpsertGoal();
  const [draft, setDraft] = useState<string | null>(null);
  const target = draft ?? (data ? String(data.targetCount) : "");

  const save = (isPaused?: boolean) =>
    upsert.mutate({ targetCount: Number(target) || 0, isPaused });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Weekly application goal</CardTitle>
      </CardHeader>
      <CardContent>
        <DataState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
          {data && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">This week</span>
                  <span className="tabular-nums">
                    {data.submittedCount} / {data.targetCount || "—"}
                  </span>
                </div>
                <Progress value={Math.round(data.progress * 100)} />
              </div>

              <Field>
                <FieldLabel htmlFor="target">Target applications per week</FieldLabel>
                <Input
                  id="target"
                  type="number"
                  min={0}
                  max={1000}
                  value={target}
                  onChange={(e) => setDraft(e.target.value)}
                  className="sm:w-40"
                />
                <FieldDescription>Counts submitted applications, excluding saved jobs.</FieldDescription>
              </Field>

              <div className="flex items-center gap-2">
                <Button onClick={() => save(false)} disabled={upsert.isPending}>
                  {upsert.isPending && <Spinner className="size-4" />}
                  Save goal
                </Button>
                {data.hasGoal && (
                  <Button variant="outline" onClick={() => save(!data.isPaused)} disabled={upsert.isPending}>
                    {data.isPaused ? "Resume" : "Pause"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DataState>
      </CardContent>
    </Card>
  );
}