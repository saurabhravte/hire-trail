import type { OfferDecision, PayPeriod, WorkMode } from "@/constants/enums";

export interface Offer {
  id: string;
  applicationId: string;
  ownerId: string;
  companyName: string | null;
  role: string | null;
  basePay: number | null;
  variablePay: number | null;
  bonus: number | null;
  equityNotes: string | null;
  currency: string | null;
  payPeriod: PayPeriod | null;
  benefits: string | null;
  workMode: WorkMode | null;
  location: string | null;
  joiningDate: string | null;
  deadline: string | null;
  decision: OfferDecision;
  createdAt: string;
  updatedAt: string;
}

export interface OfferPayload {
  applicationId: string;
  basePay?: number | null;
  variablePay?: number | null;
  bonus?: number | null;
  equityNotes?: string | null;
  currency?: string | null;
  payPeriod?: PayPeriod | null;
  benefits?: string | null;
  workMode?: WorkMode | null;
  location?: string | null;
  joiningDate?: string | null;
  deadline?: string | null;
  decision: OfferDecision;
}

export interface OfferComparison {
  offers: Offer[];
  comparable: boolean;
}