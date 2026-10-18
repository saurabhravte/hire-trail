import { useQuery } from "@tanstack/react-query";
import { platformsService } from "../services/platforms.service";

export const platformKeys = {
  all: ["platforms"] as const,
  list: ["platforms", "list"] as const,
};

export function usePlatforms() {
  return useQuery({
    queryKey: platformKeys.list,
    queryFn: () => platformsService.list(),
    staleTime: 5 * 60_000,
  });
}