import { useQuery } from "@tanstack/react-query";
import { resumesService } from "../services/resumes.service";

export const resumeKeys = {
  all: ["resumes"] as const,
  list: ["resumes", "list"] as const,
};

export function useResumes() {
  return useQuery({
    queryKey: resumeKeys.list,
    queryFn: () => resumesService.list(),
    staleTime: 5 * 60_000,
  });
}