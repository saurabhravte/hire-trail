import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GitCompareArrows, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useOffers } from "@/features/offers/hooks/use-offers";
import { OfferCard } from "@/features/offers/components/offer-card";
import { OfferComparison } from "@/features/offers/components/offer-comparison";
import { OfferFormDialog } from "@/features/offers/components/offer-form-dialog";

export const Route = createFileRoute("/_app/offers")({ component: OffersPage });

function OffersPage() {
  const { data, isLoading, isError, error, refetch } = useOffers();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [comparing, setComparing] = useState(false);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectedIds = [...selected];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Offers"
        description="Record offers and compare them side by side."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={selectedIds.length < 2}
              onClick={() => setComparing((v) => !v)}
            >
              <GitCompareArrows /> {comparing ? "Hide comparison" : `Compare (${selectedIds.length})`}
            </Button>
            <Button onClick={() => setFormOpen(true)}>
              <Plus /> Add offer
            </Button>
          </div>
        }
      />

      {comparing && selectedIds.length >= 2 && <OfferComparison ids={selectedIds} />}

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={(data ?? []).length === 0}
        emptyTitle="No offers yet"
        emptyDescription="Add an offer once you receive one to compare compensation."
        emptyAction={
          <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
            <Plus /> Add offer
          </Button>
        }
        loadingFallback={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              selected={selected.has(offer.id)}
              onToggle={toggle}
            />
          ))}
        </div>
        {selectedIds.length === 1 && (
          <p className="text-center text-xs text-muted-foreground">
            Select one more offer to compare.
          </p>
        )}
      </DataState>

      <OfferFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}