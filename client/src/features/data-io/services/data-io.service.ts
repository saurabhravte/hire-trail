import { api, saveBlob } from "@/lib/api-client";
import type { ImportCommitResult, ImportPreview } from "../types";

export const dataIoService = {
  exportCsv: async () => {
    const blob = await api.download("/export/applications");
    saveBlob(blob, "applications.csv");
  },
  previewImport: (file: File) => {
    const form = new FormData();
    form.set("file", file);
    return api.upload<ImportPreview>("/import/applications/preview", form, "POST");
  },
  commitImport: (importJobId: string) =>
    api.post<ImportCommitResult>("/import/applications/commit", { importJobId }),
};