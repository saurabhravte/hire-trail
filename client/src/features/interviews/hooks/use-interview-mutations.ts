import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applicationKeys } from "@/features/applications/hooks/use-applications";
import { interviewsService } from "../services/interviews.service";
import { interviewKeys } from "./use-interviews";
import type { InterviewPayload } from "../types";

function useInvalidate() {
  const qc = useQueryClient();
  return (applicationId?: string) => {
    qc.invalidateQueries({ queryKey: interviewKeys.all });
    qc.invalidateQueries({ queryKey: ["analytics"] });
    qc.invalidateQueries({ queryKey: ["notifications"] });
    if (applicationId) {
      qc.invalidateQueries({ queryKey: applicationKeys.activity(applicationId) });
    }
  };
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useCreateInterview() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ applicationId, payload }: { applicationId: string; payload: InterviewPayload }) =>
      interviewsService.create(applicationId, payload),
    onSuccess: (iv) => {
      invalidate(iv.applicationId);
      toast.success("Interview scheduled");
    },
    onError,
  });
}

export function useUpdateInterview() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<InterviewPayload> }) =>
      interviewsService.update(id, payload),
    onSuccess: (iv) => {
      invalidate(iv.applicationId);
      toast.success("Interview updated");
    },
    onError,
  });
}

export function useDeleteInterview() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (args: { id: string; applicationId: string }) =>
      interviewsService.remove(args.id),
    onSuccess: (_res, args) => {
      invalidate(args.applicationId);
      toast.success("Interview deleted");
    },
    onError,
  });
}