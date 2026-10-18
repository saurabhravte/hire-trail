export interface ResumeVersion {
  id: string;
  ownerId: string;
  label: string;
  storageKey: string | null;
  fileName: string | null;
  filePath: string | null;
  fileSize: number | null;
  mimeType: string | null;
  coverLetterUrl: string | null;
  portfolioUrl: string | null;
  notes: string | null;
  isDefault: boolean;
  uploadedAt: string;
  updatedAt: string;
  downloadUrl?: string | null;
}