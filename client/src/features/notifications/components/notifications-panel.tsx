import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { useMarkAllRead, useNotifications } from "../hooks/use-notifications";
import { NotificationItem } from "./notification-item";

export function NotificationsPanel() {
  const { notifications, unreadCount } = useNotifications();
  const markAll = useMarkAllRead();
  const unread = notifications.filter((n) => !n.readAt);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications">
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-sm font-medium">Notifications</p>
          {unread.length > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => markAll.mutate(unread)}
              disabled={markAll.isPending}
            >
              <CheckCheck /> Mark all read
            </Button>
          )}
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Bell />}
              title="You’re all caught up"
              description="Interview and follow-up reminders show up here."
            />
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="divide-y">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}