import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dataIoService } from "../services/data-io.service";

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useExportCsv() {
  return useMutation({
    mutationFn: () => dataIoService.exportCsv(),
    onSuccess: () => toast.success("CSV exported"),
    onError,
  });
}

export function usePreviewImport() {
  return useMutation({
    mutationFn: (file: File) => dataIoService.previewImport(file),
    onError,
  });
}

export function useCommitImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (importJobId: string) => dataIoService.commitImport(importJobId),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["companies"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      toast.success(`${res.imported} applications imported`);
    },
    onError,
  });
}