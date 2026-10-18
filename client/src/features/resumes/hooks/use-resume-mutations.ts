import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resumesService } from "../services/resumes.service";
import { resumeKeys } from "./use-resumes";

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: resumeKeys.all });
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useCreateResume() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (form: FormData) => resumesService.create(form),
    onSuccess: () => {
      invalidate();
      toast.success("Resume added");
    },
    onError,
  });
}

export function useUpdateResume() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      resumesService.update(id, form),
    onSuccess: () => {
      invalidate();
      toast.success("Resume updated");
    },
    onError,
  });
}

export function useSetDefaultResume() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => resumesService.setDefault(id),
    onSuccess: () => {
      invalidate();
      toast.success("Default resume set");
    },
    onError,
  });
}

export function useDeleteResume() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => resumesService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Resume deleted");
    },
    onError,
  });
}