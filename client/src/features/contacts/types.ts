export interface Contact {
  id: string;
  ownerId: string;
  companyId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  role: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPayload {
  companyId?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  role?: string | null;
  notes?: string | null;
}

export interface ContactListParams {
  companyId?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}