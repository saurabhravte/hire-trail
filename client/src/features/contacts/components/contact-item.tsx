import { useState } from "react";
import { Linkedin, Mail, Phone, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteContact } from "../hooks/use-contact-mutations";
import { ContactFormDialog } from "./contact-form-dialog";
import type { Contact } from "../types";

export function ContactItem({ contact }: { contact: Contact }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const remove = useDeleteContact();

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border p-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {contact.name}
          {contact.role && <span className="font-normal text-muted-foreground"> · {contact.role}</span>}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-foreground">
              <Mail className="size-3" /> {contact.email}
            </a>
          )}
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-foreground">
              <Phone className="size-3" /> {contact.phone}
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Linkedin className="size-3" /> LinkedIn
            </a>
          )}
        </div>
        {contact.notes && <p className="mt-1 text-xs text-muted-foreground">{contact.notes}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button variant="ghost" size="icon-xs" aria-label="Edit contact" onClick={() => setEditOpen(true)}>
          <Pencil />
        </Button>
        <Button variant="ghost" size="icon-xs" aria-label="Delete contact" onClick={() => setDeleteOpen(true)}>
          <Trash2 />
        </Button>
      </div>

      <ContactFormDialog open={editOpen} onOpenChange={setEditOpen} contact={contact} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this contact?"
        confirmLabel="Delete"
        destructive
        onConfirm={() => remove.mutate(contact.id)}
      />
    </div>
  );
}