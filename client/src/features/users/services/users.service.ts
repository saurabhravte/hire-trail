import { api, saveBlob } from "@/lib/api-client";
import type { PreferencesPayload, ProfilePayload, UserProfile } from "../types";

export const usersService = {
  me: () => api.get<UserProfile>("/me"),
  updateProfile: (payload: ProfilePayload) => api.patch<UserProfile>("/me", payload),
  updatePreferences: (payload: PreferencesPayload) =>
    api.patch<UserProfile>("/me/preferences", payload),
  deleteAccount: () => api.delete<{ deleted: boolean }>("/me"),
  exportData: async () => {
    const blob = await api.download("/me/export");
    saveBlob(blob, "my-data-export.json");
  },
};