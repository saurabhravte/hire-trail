import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsService } from "../services/notifications.service";
import type { AppNotification } from "../types";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: ["notifications", "list"] as const,
};

export function useNotifications() {
  const query = useQuery({
    queryKey: notificationKeys.list,
    queryFn: () => notificationsService.list(),
    refetchInterval: 60_000, // light polling so reminders surface without a manual refresh
  });

  const visible = (query.data?.data ?? []).filter((n) => !n.dismissedAt);
  const unreadCount = visible.filter((n) => !n.readAt).length;
  return { ...query, notifications: visible, unreadCount };
}

function useNotificationMutation(
  fn: (n: AppNotification) => Promise<unknown>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (err) => toast.error(err instanceof Error ? err.message : "Action failed"),
  });
}

export function useMarkRead() {
  return useNotificationMutation((n) => notificationsService.update(n.id, { read: true }));
}

export function useDismiss() {
  return useNotificationMutation((n) => notificationsService.update(n.id, { dismissed: true }));
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (unread: AppNotification[]) =>
      Promise.all(unread.map((n) => notificationsService.update(n.id, { read: true }))),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (err) => toast.error(err instanceof Error ? err.message : "Action failed"),
  });
}