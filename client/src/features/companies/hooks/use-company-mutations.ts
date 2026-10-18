import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesService } from "../services/companies.service";
import { companyKeys } from "./use-companies";
import type { CompanyPayload } from "../types";

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: companyKeys.all });
    qc.invalidateQueries({ queryKey: ["applications"] });
  };
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useCreateCompany() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: CompanyPayload) => companiesService.create(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Company added");
    },
    onError,
  });
}

export function useUpdateCompany() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CompanyPayload> }) =>
      companiesService.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Company updated");
    },
    onError,
  });
}

export function useDeleteCompany() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => companiesService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Company deleted");
    },
    onError,
  });
}