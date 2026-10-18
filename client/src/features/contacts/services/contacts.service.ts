import { api } from "@/lib/api-client";
import type { Contact, ContactListParams, ContactPayload } from "../types";

export const contactsService = {
  list: (params: ContactListParams = {}) =>
    api.getList<Contact>("/contacts", params as Record<string, unknown>),
  create: (payload: ContactPayload) => api.post<Contact>("/contacts", payload),
  update: (id: string, payload: Partial<ContactPayload>) =>
    api.patch<Contact>(`/contacts/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/contacts/${id}`),
};