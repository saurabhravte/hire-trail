import { useQuery } from "@tanstack/react-query";
import { contactsService } from "../services/contacts.service";
import type { ContactListParams } from "../types";

export const contactKeys = {
  all: ["contacts"] as const,
  list: (params: ContactListParams) => ["contacts", "list", params] as const,
};

export function useContacts(params: ContactListParams = {}) {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => contactsService.list(params),
  });
}