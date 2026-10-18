import type { TaskPriority } from "@/constants/enums";

export type TaskState = "pending" | "completed";

export interface Task {
  id: string;
  ownerId: string;
  applicationId: string | null;
  title: string;
  description: string | null;
  dueTime: string | null;
  timezone: string;
  priority: TaskPriority;
  state: TaskState;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  applicationId?: string | null;
  title: string;
  description?: string | null;
  dueTime?: string | null;
  timezone: string;
  priority: TaskPriority;
  state?: TaskState;
}

export type TaskFilter = "all" | "upcoming" | "overdue";

export interface TaskListParams {
  applicationId?: string;
  state?: TaskState;
  filter?: TaskFilter;
}