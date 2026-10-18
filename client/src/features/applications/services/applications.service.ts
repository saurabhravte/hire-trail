import { api } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api";
import type {
  Application,
  ActivityEntry,
  ApplicationListParams,
  ApplicationPayload,
  CompanyGroup,
  StatusHistoryEntry,
} from "../types";

export const applicationsService = {
  list: (params: ApplicationListParams): Promise<ApiEnvelope<Application[]>> =>
    api.getList<Application>("/applications", params as Record<string, unknown>),

  grouped: (archived: boolean) =>
    api.get<CompanyGroup[]>("/applications/grouped", {
      archived: archived ? "all" : "false",
    }),

  getById: (id: string) => api.get<Application>(`/applications/${id}`),

  history: (id: string) => api.get<StatusHistoryEntry[]>(`/applications/${id}/history`),

  activity: (id: string) => api.get<ActivityEntry[]>(`/applications/${id}/activity`),

  duplicates: (params: { companyName?: string; role?: string; jobUrl?: string }) =>
    api.get<Application[]>("/applications/duplicates", params),

  create: (payload: ApplicationPayload) => api.post<Application>("/applications", payload),

  update: (id: string, payload: Partial<ApplicationPayload>) =>
    api.patch<Application>(`/applications/${id}`, payload),

  changeStatus: (id: string, status: string, note?: string) =>
    api.patch<Application>(`/applications/${id}/status`, { status, note }),

  archive: (id: string) => api.post<Application>(`/applications/${id}/archive`),

  restore: (id: string) => api.post<Application>(`/applications/${id}/restore`),

  remove: (id: string) => api.delete<{ id: string }>(`/applications/${id}`),

  bulk: (ids: string[], action: "archive" | "restore" | "delete") =>
    api.post<{ affected: number }>("/applications/bulk", { ids, action }),
};