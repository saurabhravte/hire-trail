import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { applicationsService } from "../services/applications.service";

/** Non-blocking duplicate lookup for the create/edit form (PRD §6). */
export function useDuplicateCheck(input: {
  companyName: string;
  role: string;
  jobUrl?: string;
  enabled: boolean;
  excludeId?: string;
}) {
  const debouncedCompany = useDebounce(input.companyName, 500);
  const debouncedRole = useDebounce(input.role, 500);
  const debouncedUrl = useDebounce(input.jobUrl ?? "", 500);

  const canQuery =
    input.enabled && debouncedCompany.trim().length > 1 && debouncedRole.trim().length > 1;

  const query = useQuery({
    queryKey: ["applications", "duplicates", debouncedCompany, debouncedRole, debouncedUrl],
    queryFn: () =>
      applicationsService.duplicates({
        companyName: debouncedCompany,
        role: debouncedRole,
        jobUrl: debouncedUrl || undefined,
      }),
    enabled: canQuery,
  });

  const matches = (query.data ?? []).filter((m) => m.id !== input.excludeId);
  return { matches, isChecking: query.isFetching };
}