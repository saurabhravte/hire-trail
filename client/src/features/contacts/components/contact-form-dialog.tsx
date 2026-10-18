import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  contactFormSchema,
  emptyContactValues,
  toContactFormValues,
  toContactPayload,
  type ContactFormValues,
} from "../schemas/contact-form.schema";
import { useCreateContact, useUpdateContact } from "../hooks/use-contact-mutations";
import type { Contact } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string | null;
  contact?: Contact;
}

export function ContactFormDialog({ open, onOpenChange, companyId, contact }: Props) {
  const isEdit = Boolean(contact);
  const create = useCreateContact();
  const update = useUpdateContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: emptyContactValues,
  });

  useEffect(() => {
    if (open) reset(contact ? toContactFormValues(contact) : emptyContactValues);
  }, [open, contact, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = toContactPayload(values, contact?.companyId ?? companyId);
    if (isEdit && contact) await update.mutateAsync({ id: contact.id, payload });
    else await create.mutateAsync(payload);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit contact" : "Add contact"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="name">Name *</FieldLabel>
              <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Input id="role" placeholder="Recruiter, Hiring manager…" {...register("role")} />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" {...register("email")} aria-invalid={!!errors.email} />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input id="phone" {...register("phone")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="linkedinUrl">LinkedIn</FieldLabel>
              <Input id="linkedinUrl" {...register("linkedinUrl")} aria-invalid={!!errors.linkedinUrl} />
              <FieldError>{errors.linkedinUrl?.message}</FieldError>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="size-4" />}
              {isEdit ? "Save" : "Add contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}