import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATES } from "../../../common/db/schema.js";

const emptyToUndef = (v: unknown) => (v === "" ? undefined : v);
const emptyOrNull = (v: unknown) => (v === "" || v === null ? undefined : v);

export const createTaskBody = z.object({
  applicationId: z.preprocess(emptyOrNull, z.string().uuid().optional()),
  title: z.string().trim().min(1, "Title is required").max(300),
  description: z.preprocess(emptyOrNull, z.string().max(5000).optional()),
  dueTime: z.preprocess(emptyOrNull, z.coerce.date().optional()),
  timezone: z.string().min(1).max(60).default("UTC"),
  priority: z.enum(TASK_PRIORITIES).default("normal"),
});

export const updateTaskBody = z.object({
  applicationId: z.preprocess(emptyToUndef, z.string().uuid().nullable().optional()),
  title: z.string().trim().min(1).max(300).optional(),
  description: z.preprocess(emptyToUndef, z.string().max(5000).nullable().optional()),
  dueTime: z.preprocess(emptyToUndef, z.coerce.date().nullable().optional()),
  timezone: z.string().min(1).max(60).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  state: z.enum(TASK_STATES).optional(),
});

export const listTasksQuery = z.object({
  applicationId: z.string().uuid().optional(),
  state: z.enum(TASK_STATES).optional(),
  filter: z.enum(["upcoming", "overdue", "all"]).default("all"),
});

export type CreateTaskBody = z.infer<typeof createTaskBody>;
export type UpdateTaskBody = z.infer<typeof updateTaskBody>;
export type ListTasksQuery = z.infer<typeof listTasksQuery>;