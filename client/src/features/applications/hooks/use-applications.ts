import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { applicationsService } from "../services/applications.service";
import type { ApplicationListParams } from "../types";

export const applicationKeys = {
  all: ["applications"] as const,
  list: (params: ApplicationListParams) => ["applications", "list", params] as const,
  grouped: (archived: boolean) => ["applications", "grouped", archived] as const,
  detail: (id: string) => ["applications", "detail", id] as const,
  history: (id: string) => ["applications", "history", id] as const,
  activity: (id: string) => ["applications", "activity", id] as const,
};

export function useApplicationsList(params: ApplicationListParams) {
  return useQuery({
    queryKey: applicationKeys.list(params),
    queryFn: () => applicationsService.list(params),
    placeholderData: keepPreviousData, // smooth pagination/sort transitions
  });
}

export function useApplicationsGrouped(archived: boolean) {
  return useQuery({
    queryKey: applicationKeys.grouped(archived),
    queryFn: () => applicationsService.grouped(archived),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: () => applicationsService.getById(id),
  });
}

export function useApplicationHistory(id: string) {
  return useQuery({
    queryKey: applicationKeys.history(id),
    queryFn: () => applicationsService.history(id),
  });
}

export function useApplicationActivity(id: string) {
  return useQuery({
    queryKey: applicationKeys.activity(id),
    queryFn: () => applicationsService.activity(id),
  });
}