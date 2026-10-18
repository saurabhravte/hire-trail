import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersService } from "../services/users.service";
import type { PreferencesPayload, ProfilePayload } from "../types";

export const userKeys = {
  me: ["me"] as const,
};

export function useProfile() {
  return useQuery({ queryKey: userKeys.me, queryFn: () => usersService.me() });
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfilePayload) => usersService.updateProfile(payload),
    onSuccess: (data) => {
      qc.setQueryData(userKeys.me, data);
      qc.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Profile updated");
    },
    onError,
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PreferencesPayload) => usersService.updatePreferences(payload),
    onSuccess: (data) => {
      qc.setQueryData(userKeys.me, data);
      toast.success("Preferences saved");
    },
    onError,
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: () => usersService.exportData(),
    onSuccess: () => toast.success("Data export downloaded"),
    onError,
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => usersService.deleteAccount(),
    onError,
  });
}