import { api } from "@/lib/api-client";
import type { ResumeVersion } from "../types";

export const resumesService = {
  list: () => api.get<ResumeVersion[]>("/resumes"),
  getById: (id: string) => api.get<ResumeVersion>(`/resumes/${id}`),
  signedUrl: (id: string) =>
    api.get<{ url: string; expiresInSeconds: number }>(`/resumes/${id}/signed-url`),
  create: (form: FormData) => api.upload<ResumeVersion>("/resumes", form, "POST"),
  update: (id: string, form: FormData) =>
    api.upload<ResumeVersion>(`/resumes/${id}`, form, "PATCH"),
  setDefault: (id: string) => api.post<ResumeVersion>(`/resumes/${id}/default`),
  remove: (id: string) => api.delete<{ id: string }>(`/resumes/${id}`),
};