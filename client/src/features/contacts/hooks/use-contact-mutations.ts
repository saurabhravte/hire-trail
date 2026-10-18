import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { contactsService } from "../services/contacts.service";
import { contactKeys } from "./use-contacts";
import type { ContactPayload } from "../types";

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: contactKeys.all });
}

const onError = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Something went wrong");

export function useCreateContact() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: ContactPayload) => contactsService.create(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Contact added");
    },
    onError,
  });
}

export function useUpdateContact() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ContactPayload> }) =>
      contactsService.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Contact updated");
    },
    onError,
  });
}

export function useDeleteContact() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => contactsService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Contact deleted");
    },
    onError,
  });
}