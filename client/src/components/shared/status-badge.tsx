import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/constants/status";
import type { ApplicationStatus } from "@/constants/enums";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.badgeClass)}>
      {config.label}
    </Badge>
  );
}