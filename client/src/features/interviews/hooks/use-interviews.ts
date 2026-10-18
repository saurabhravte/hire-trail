import { useQuery } from "@tanstack/react-query";
import { interviewsService } from "../services/interviews.service";
import type { InterviewListParams } from "../types";

export const interviewKeys = {
  all: ["interviews"] as const,
  list: (params: InterviewListParams) => ["interviews", "list", params] as const,
};

export function useInterviews(params: InterviewListParams = {}) {
  return useQuery({
    queryKey: interviewKeys.list(params),
    queryFn: () => interviewsService.list(params),
  });
}

export function useApplicationInterviews(applicationId: string) {
  return useInterviews({ applicationId });
}