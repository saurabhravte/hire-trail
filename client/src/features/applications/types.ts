import type {
  ApplicationStatus,
  PayPeriod,
  Priority,
  WorkMode,
} from "@/constants/enums";

export interface Application {
  id: string;
  ownerId: string;
  companyId: string | null;
  companyName: string | null;
  role: string;
  status: ApplicationStatus;
  appliedDate: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  payPeriod: PayPeriod | null;
  location: string | null;
  workMode: WorkMode | null;
  techStack: string[];
  platformId: string | null;
  resumeVersionId: string | null;
  jobUrl: string | null;
  jobId: string | null;
  priority: Priority;
  recruiterName: string | null;
  recruiterEmail: string | null;
  recruiterPhone: string | null;
  referralPerson: string | null;
  referralNotes: string | null;
  notes: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  applicationId: string;
  previousStatus: ApplicationStatus | null;
  newStatus: ApplicationStatus;
  note: string | null;
  changedAt: string;
}

export interface ActivityEntry {
  id: string;
  applicationId: string;
  eventType: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface CompanyGroup {
  companyId: string | null;
  companyName: string;
  count: number;
  applications: Application[];
}

export type SortField =
  | "company"
  | "role"
  | "appliedDate"
  | "salary"
  | "status"
  | "updatedAt"
  | "priority";

export interface ApplicationListParams {
  q?: string;
  status?: ApplicationStatus[];
  workMode?: WorkMode[];
  priority?: Priority[];
  platformId?: string[];
  techStack?: string[];
  location?: string;
  companyId?: string;
  appliedFrom?: string;
  appliedTo?: string;
  archived?: "true" | "false" | "all";
  sort?: SortField;
  dir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ApplicationPayload {
  companyName?: string;
  companyId?: string;
  role: string;
  status: ApplicationStatus;
  appliedDate?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  payPeriod?: PayPeriod | null;
  location?: string | null;
  workMode?: WorkMode | null;
  techStack: string[];
  platformId?: string | null;
  resumeVersionId?: string | null;
  jobUrl?: string | null;
  jobId?: string | null;
  priority: Priority;
  recruiterName?: string | null;
  recruiterEmail?: string | null;
  recruiterPhone?: string | null;
  referralPerson?: string | null;
  referralNotes?: string | null;
  notes?: string | null;
  statusNote?: string;
}