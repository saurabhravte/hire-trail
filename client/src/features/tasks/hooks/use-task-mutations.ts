import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applicationKeys } from "@/features/applications/hooks/use-applications";
import { tasksService } from "../services/tasks.service";
import { taskKeys } from "./use-tasks";
import type { TaskPayload } from "../types";

function useInvalidate() {
  const qc = useQueryClient();
  return (applicationId?: string | null) => {
    qc.invalidateQueries({ queryKey: taskKeys.all });
    qc.invalidateQueries({ queryKey: ["analytics"] });
    qc.invalidateQueries({ queryKey: ["notifications"] });
    if (applicationId) {
      qc.invalidateQueries({ queryKey: applicationKeys.activity(applicationId) });
    }
  };
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useCreateTask() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: TaskPayload) => tasksService.create(payload),
    onSuccess: (task) => {
      invalidate(task.applicationId);
      toast.success("Task added");
    },
    onError,
  });
}

export function useUpdateTask() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TaskPayload> }) =>
      tasksService.update(id, payload),
    onSuccess: (task) => {
      invalidate(task.applicationId);
      toast.success("Task updated");
    },
    onError,
  });
}

export function useToggleTask() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, complete }: { id: string; complete: boolean; applicationId?: string | null }) =>
      complete ? tasksService.complete(id) : tasksService.update(id, { state: "pending" }),
    onSuccess: (task) => invalidate(task.applicationId),
    onError,
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (args: { id: string; applicationId?: string | null }) =>
      tasksService.remove(args.id),
    onSuccess: (_res, args) => {
      invalidate(args.applicationId);
      toast.success("Task deleted");
    },
    onError,
  });
}