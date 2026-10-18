export interface Platform {
  id: string;
  ownerId: string | null;
  name: string;
  isActive: boolean;
  isSystem: boolean;
  applicationCount: number;
  submittedCount: number;
  respondedCount: number;
  responseRate: number;
}