import { api } from "@/lib/api-client";
import type { AppNotification } from "../types";

export const notificationsService = {
  list: () => api.getList<AppNotification>("/notifications", { pageSize: 50 }),
  update: (id: string, patch: { read?: boolean; dismissed?: boolean }) =>
    api.patch<AppNotification>(`/notifications/${id}`, patch),
};