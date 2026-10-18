export interface Company {
  id: string;
  ownerId: string;
  name: string;
  normalizedName: string;
  website: string | null;
  notes: string | null;
  applicationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyPayload {
  name: string;
  website?: string | null;
  notes?: string | null;
}

export interface CompanyListParams {
  q?: string;
  page?: number;
  pageSize?: number;
}