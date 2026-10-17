import { api } from "@/lib/api-client";
import type { UpsertGoalInput, WeeklyGoalProgress } from "../types";

export const goalsService = {
  getCurrent: () => api.get<WeeklyGoalProgress>("/goals/current"),
  upsertCurrent: (input: UpsertGoalInput) => api.put("/goals/current", input),
};