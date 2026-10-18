import { api } from "@/lib/api-client";
import type { ResumeVersion } from "../types";

export const resumesService = {
  list: () => api.get<ResumeVersion[]>("/resumes"),
};