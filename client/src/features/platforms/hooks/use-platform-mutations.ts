import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { platformKeys } from "./use-platforms";
import type { Platform } from "../types";

const platformMutations = {
  create: (name: string) => api.post<Platform>("/platforms", { name }),
  update: (id: string, patch: { name?: string; isActive?: boolean }) =>
    api.patch<Platform>(`/platforms/${id}`, patch),
  remove: (id: string) => api.delete<{ id: string }>(`/platforms/${id}`),
};

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: platformKeys.all });
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useCreatePlatform() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (name: string) => platformMutations.create(name),
    onSuccess: () => {
      invalidate();
      toast.success("Platform added");
    },
    onError,
  });
}

export function useUpdatePlatform() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { name?: string; isActive?: boolean } }) =>
      platformMutations.update(id, patch),
    onSuccess: invalidate,
    onError,
  });
}

export function useDeletePlatform() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => platformMutations.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Platform deleted");
    },
    onError,
  });
}