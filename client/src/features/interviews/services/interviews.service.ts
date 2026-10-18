import { api } from "@/lib/api-client";
import type { Interview, InterviewListParams, InterviewPayload } from "../types";

export const interviewsService = {
  list: (params: InterviewListParams = {}) =>
    api.get<Interview[]>("/interviews", params as Record<string, unknown>),
  create: (applicationId: string, payload: InterviewPayload) =>
    api.post<Interview>(`/applications/${applicationId}/interviews`, payload),
  update: (id: string, payload: Partial<InterviewPayload>) =>
    api.patch<Interview>(`/interviews/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/interviews/${id}`),
};