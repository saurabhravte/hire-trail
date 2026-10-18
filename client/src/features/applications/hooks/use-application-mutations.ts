import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applicationsService } from "../services/applications.service";
import { applicationKeys } from "./use-applications";
import type { ApplicationPayload } from "../types";

function useInvalidate() {
  const qc = useQueryClient();
  return (id?: string) => {
    qc.invalidateQueries({ queryKey: applicationKeys.all });
    if (id) {
      qc.invalidateQueries({ queryKey: applicationKeys.detail(id) });
      qc.invalidateQueries({ queryKey: applicationKeys.history(id) });
      qc.invalidateQueries({ queryKey: applicationKeys.activity(id) });
    }
    qc.invalidateQueries({ queryKey: ["analytics"] });
    qc.invalidateQueries({ queryKey: ["goals"] });
  };
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useCreateApplication() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: ApplicationPayload) => applicationsService.create(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Application added");
    },
    onError,
  });
}

export function useUpdateApplication() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ApplicationPayload> }) =>
      applicationsService.update(id, payload),
    onSuccess: (app) => {
      invalidate(app.id);
      toast.success("Application updated");
    },
    onError,
  });
}

export function useChangeStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      applicationsService.changeStatus(id, status, note),
    onSuccess: (app) => {
      invalidate(app.id);
      toast.success("Status updated");
    },
    onError,
  });
}

export function useArchiveApplication() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      archived ? applicationsService.archive(id) : applicationsService.restore(id),
    onSuccess: (app) => {
      invalidate(app.id);
      toast.success(app.isArchived ? "Archived" : "Restored");
    },
    onError,
  });
}

export function useDeleteApplication() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => applicationsService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Application deleted");
    },
    onError,
  });
}

export function useBulkAction() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ ids, action }: { ids: string[]; action: "archive" | "restore" | "delete" }) =>
      applicationsService.bulk(ids, action),
    onSuccess: (res, vars) => {
      invalidate();
      toast.success(`${res.affected} ${vars.action === "delete" ? "deleted" : `${vars.action}d`}`);
    },
    onError,
  });
}