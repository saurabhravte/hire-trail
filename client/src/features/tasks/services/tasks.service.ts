import { api } from "@/lib/api-client";
import type { Task, TaskListParams, TaskPayload } from "../types";

export const tasksService = {
  list: (params: TaskListParams = {}) =>
    api.get<Task[]>("/tasks", params as Record<string, unknown>),
  create: (payload: TaskPayload) => api.post<Task>("/tasks", payload),
  update: (id: string, payload: Partial<TaskPayload>) => api.patch<Task>(`/tasks/${id}`, payload),
  complete: (id: string) => api.post<Task>(`/tasks/${id}/complete`),
  remove: (id: string) => api.delete<{ id: string }>(`/tasks/${id}`),
};