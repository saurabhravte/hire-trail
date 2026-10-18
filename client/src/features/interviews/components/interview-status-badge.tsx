import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { INTERVIEW_STATUS_CONFIG } from "@/constants/interview";
import type { InterviewStatus } from "@/constants/enums";

export function InterviewStatusBadge({ status }: { status: InterviewStatus }) {
  const config = INTERVIEW_STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.badgeClass)}>
      {config.label}
    </Badge>
  );
}