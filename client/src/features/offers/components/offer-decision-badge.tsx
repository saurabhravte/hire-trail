import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { humanize } from "@/lib/format";
import type { OfferDecision } from "@/constants/enums";

const CLASSES: Record<OfferDecision, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  declined: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  expired: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20",
};

export function OfferDecisionBadge({ decision }: { decision: OfferDecision }) {
  return (
    <Badge variant="outline" className={cn("font-medium", CLASSES[decision])}>
      {humanize(decision)}
    </Badge>
  );
}