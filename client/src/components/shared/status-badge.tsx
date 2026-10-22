import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/constants/status";
import type { ApplicationStatus } from "@/constants/enums";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        config.badgeClass,
      )}
    >
      {config.dot && (
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: config.color }}
        />
      )}
      {config.label}
    </Badge>
  );
}
