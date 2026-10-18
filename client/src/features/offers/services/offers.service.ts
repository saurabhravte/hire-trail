import { api } from "@/lib/api-client";
import type { Offer, OfferComparison, OfferPayload } from "../types";

export const offersService = {
  list: () => api.get<Offer[]>("/offers"),
  compare: (ids: string[]) => api.get<OfferComparison>("/offers/compare", { ids }),
  create: (payload: OfferPayload) => api.post<Offer>("/offers", payload),
  update: (id: string, payload: Partial<OfferPayload>) => api.patch<Offer>(`/offers/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/offers/${id}`),
};