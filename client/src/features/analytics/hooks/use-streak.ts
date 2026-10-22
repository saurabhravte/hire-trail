import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface StreakData {
  current: number;
  longest: number;
  appliedToday: boolean;
  heatmap: { date: string; count: number }[];
}

export const streakKeys = {
  all: ["analytics", "streak"] as const,
};

export function useStreak() {
  return useQuery({
    queryKey: streakKeys.all,
    queryFn: () => api.get<StreakData>("/analytics/streak"),
    staleTime: 60_000,
  });
}
