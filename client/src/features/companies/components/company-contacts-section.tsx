import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/shared/data-state";
import { ContactFormDialog } from "@/features/contacts/components/contact-form-dialog";
import { ContactItem } from "@/features/contacts/components/contact-item";
import { useContacts } from "@/features/contacts/hooks/use-contacts";

export function CompanyContactsSection({ companyId }: { companyId: string }) {
  const { data, isLoading, isError, error, refetch } = useContacts({ companyId, pageSize: 100 });
  const [formOpen, setFormOpen] = useState(false);
  const contacts = data?.data ?? [];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Contacts {contacts.length > 0 && `(${contacts.length})`}
        </p>
        <Button size="xs" variant="ghost" onClick={() => setFormOpen(true)}>
          <Plus /> Add contact
        </Button>
      </div>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={contacts.length === 0}
        emptyTitle=""
        loadingFallback={<div className="h-10 animate-pulse rounded-lg bg-muted" />}
      >
        {contacts.length > 0 ? (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No contacts yet for this company.</p>
        )}
      </DataState>

      <ContactFormDialog open={formOpen} onOpenChange={setFormOpen} companyId={companyId} />
    </div>
  );
}