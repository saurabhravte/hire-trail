import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { companiesService } from "../services/companies.service";
import type { CompanyListParams } from "../types";

export const companyKeys = {
  all: ["companies"] as const,
  list: (params: CompanyListParams) => ["companies", "list", params] as const,
};

export function useCompanies(params: CompanyListParams) {
  return useQuery({
    queryKey: companyKeys.list(params),
    queryFn: () => companiesService.list(params),
    placeholderData: keepPreviousData,
  });
}