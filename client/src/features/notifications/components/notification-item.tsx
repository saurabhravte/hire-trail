import { CalendarClock, Check, Clock, ListChecks, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";
import { useDismiss, useMarkRead } from "../hooks/use-notifications";
import type { AppNotification } from "../types";

const ICONS: Record<string, LucideIcon> = {
  interview_upcoming: CalendarClock,
  task_due: ListChecks,
};

export function NotificationItem({ notification }: { notification: AppNotification }) {
  const Icon = ICONS[notification.type] ?? Clock;
  const isUnread = !notification.readAt;
  const markRead = useMarkRead();
  const dismiss = useDismiss();

  return (
    <div
      className={cn(
        "group/notif flex items-start gap-2.5 px-3 py-2.5 transition-colors",
        isUnread && "bg-primary/5",
      )}
    >
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-3.5">
        <Icon />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight">{notification.title}</p>
        {notification.body && (
          <p className="truncate text-xs text-muted-foreground">{notification.body}</p>
        )}
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {formatRelative(notification.scheduledTime ?? notification.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/notif:opacity-100">
        {isUnread && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Mark as read"
            onClick={() => markRead.mutate(notification)}
          >
            <Check />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Dismiss"
          onClick={() => dismiss.mutate(notification)}
        >
          <X />
        </Button>
      </div>
    </div>
  );
}