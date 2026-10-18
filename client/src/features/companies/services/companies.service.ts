import { api } from "@/lib/api-client";
import type { Company, CompanyListParams, CompanyPayload } from "../types";

export const companiesService = {
  list: (params: CompanyListParams = {}) =>
    api.getList<Company>("/companies", params as Record<string, unknown>),
  create: (payload: CompanyPayload) => api.post<Company>("/companies", payload),
  update: (id: string, payload: Partial<CompanyPayload>) =>
    api.patch<Company>(`/companies/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/companies/${id}`),
};