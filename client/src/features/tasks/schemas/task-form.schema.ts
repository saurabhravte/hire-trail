import { z } from "zod";
import { TASK_PRIORITIES } from "@/constants/enums";
import {
  getLocalTimezone,
  utcIsoToZonedInput,
  zonedInputToUtcIso,
} from "@/lib/datetime";
import type { Task, TaskPayload } from "../types";

export const NONE = "__none__";

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  description: z.string().optional().or(z.literal("")),
  applicationId: z.string().optional(),
  dueLocal: z.string().optional().or(z.literal("")),
  timezone: z.string().min(1),
  priority: z.enum(TASK_PRIORITIES),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

const blank = (v?: string) => (v && v.trim() !== "" ? v.trim() : null);

export function emptyTaskValues(applicationId?: string): TaskFormValues {
  return {
    title: "",
    description: "",
    applicationId: applicationId ?? NONE,
    dueLocal: "",
    timezone: getLocalTimezone(),
    priority: "normal",
  };
}

export function toTaskFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? "",
    applicationId: task.applicationId ?? NONE,
    dueLocal: task.dueTime ? utcIsoToZonedInput(task.dueTime, task.timezone) : "",
    timezone: task.timezone,
    priority: task.priority,
  };
}

export function toTaskPayload(v: TaskFormValues): TaskPayload {
  return {
    title: v.title.trim(),
    description: blank(v.description),
    applicationId: v.applicationId && v.applicationId !== NONE ? v.applicationId : null,
    dueTime: v.dueLocal ? zonedInputToUtcIso(v.dueLocal, v.timezone) : null,
    timezone: v.timezone,
    priority: v.priority,
  };
}