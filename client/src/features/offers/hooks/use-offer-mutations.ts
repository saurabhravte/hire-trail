import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { offersService } from "../services/offers.service";
import { offerKeys } from "./use-offers";
import type { OfferPayload } from "../types";

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: offerKeys.all });
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useCreateOffer() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: OfferPayload) => offersService.create(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Offer saved");
    },
    onError,
  });
}

export function useUpdateOffer() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<OfferPayload> }) =>
      offersService.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Offer updated");
    },
    onError,
  });
}

export function useDeleteOffer() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => offersService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Offer deleted");
    },
    onError,
  });
}