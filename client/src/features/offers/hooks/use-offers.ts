import { useQuery } from "@tanstack/react-query";
import { offersService } from "../services/offers.service";

export const offerKeys = {
  all: ["offers"] as const,
  list: ["offers", "list"] as const,
  compare: (ids: string[]) => ["offers", "compare", [...ids].sort()] as const,
};

export function useOffers() {
  return useQuery({ queryKey: offerKeys.list, queryFn: () => offersService.list() });
}

export function useCompareOffers(ids: string[]) {
  return useQuery({
    queryKey: offerKeys.compare(ids),
    queryFn: () => offersService.compare(ids),
    enabled: ids.length >= 2,
  });
}