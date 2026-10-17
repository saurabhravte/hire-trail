import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { goalsService } from "../services/goals.service";
import type { UpsertGoalInput } from "../types";

export const goalsKeys = {
  current: ["goals", "current"] as const,
};

export function useCurrentGoal() {
  return useQuery({
    queryKey: goalsKeys.current,
    queryFn: () => goalsService.getCurrent(),
  });
}

export function useUpsertGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertGoalInput) => goalsService.upsertCurrent(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalsKeys.current });
      toast.success("Weekly goal saved");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to save goal"),
  });
}