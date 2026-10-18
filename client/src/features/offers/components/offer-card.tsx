import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatDate, formatMoney } from "@/lib/format";
import { useDeleteOffer } from "../hooks/use-offer-mutations";
import { OfferDecisionBadge } from "./offer-decision-badge";
import { OfferFormDialog } from "./offer-form-dialog";
import type { Offer } from "../types";

function total(o: Offer): number {
  return (o.basePay ?? 0) + (o.variablePay ?? 0) + (o.bonus ?? 0);
}

interface Props {
  offer: Offer;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function OfferCard({ offer, selected, onToggle }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const remove = useDeleteOffer();

  return (
    <Card size="sm">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2.5">
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggle(offer.id)}
              aria-label={`Select ${offer.companyName ?? "offer"} for comparison`}
              className="mt-0.5"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{offer.companyName ?? "—"}</p>
              <p className="truncate text-xs text-muted-foreground">{offer.role ?? "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <OfferDecisionBadge decision={offer.decision} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Offer actions">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          <p className="font-heading text-lg font-semibold tabular-nums">
            {formatMoney(total(offer), offer.currency, offer.payPeriod)}
          </p>
          <p className="text-xs text-muted-foreground">
            Base {formatMoney(offer.basePay, offer.currency, offer.payPeriod)} total comp
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {offer.location && <span>{offer.location}</span>}
          {offer.deadline && <span>Decide by {formatDate(offer.deadline)}</span>}
        </div>
      </CardContent>

      <OfferFormDialog open={editOpen} onOpenChange={setEditOpen} offer={offer} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this offer?"
        description="This removes the offer details. The application itself is kept."
        confirmLabel="Delete"
        destructive
        onConfirm={() => remove.mutate(offer.id)}
      />
    </Card>
  );
}