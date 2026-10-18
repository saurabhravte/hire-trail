export interface ImportRowError {
  row: number;
  messages: string[];
}

export interface ImportDuplicate {
  row: number;
  company: string;
  role: string;
}

export interface ImportPreview {
  importJobId: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  errors: ImportRowError[];
  duplicates: ImportDuplicate[];
  sample: Record<string, unknown>[];
}

export interface ImportCommitResult {
  importJobId: string;
  imported: number;
}