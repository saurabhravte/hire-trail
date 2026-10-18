import { useQuery } from "@tanstack/react-query";
import { tasksService } from "../services/tasks.service";
import type { TaskListParams } from "../types";

export const taskKeys = {
  all: ["tasks"] as const,
  list: (params: TaskListParams) => ["tasks", "list", params] as const,
};

export function useTasks(params: TaskListParams = {}) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => tasksService.list(params),
  });
}

export function useApplicationTasks(applicationId: string) {
  return useTasks({ applicationId });
}