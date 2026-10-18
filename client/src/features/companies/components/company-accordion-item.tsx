import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteCompany } from "../hooks/use-company-mutations";
import { CompanyContactsSection } from "./company-contacts-section";
import { CompanyFormDialog } from "./company-form-dialog";
import type { Company } from "../types";

export function CompanyAccordionItem({ company }: { company: Company }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const remove = useDeleteCompany();

  return (
    <AccordionItem value={company.id}>
      <div className="flex items-center">
        <AccordionTrigger className="flex-1">
          <span className="flex items-center gap-2">
            <Building2 className="size-4 text-muted-foreground" />
            <span className="font-medium">{company.name}</span>
            {typeof company.applicationCount === "number" && (
              <Badge variant="secondary" className="h-5">
                {company.applicationCount} app{company.applicationCount === 1 ? "" : "s"}
              </Badge>
            )}
          </span>
        </AccordionTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Company actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/applications" search={{ companyId: company.id }}>
                View applications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AccordionContent className="space-y-3">
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
          >
            {company.website} <ExternalLink className="size-3.5" />
          </a>
        )}
        {company.notes && <p className="text-sm text-muted-foreground">{company.notes}</p>}
        <Separator />
        <CompanyContactsSection companyId={company.id} />
      </AccordionContent>

      <CompanyFormDialog open={editOpen} onOpenChange={setEditOpen} company={company} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${company.name}?`}
        description="The company and its contacts are removed. Applications are kept but unlinked from this company."
        confirmLabel="Delete"
        destructive
        onConfirm={() => remove.mutate(company.id)}
      />
    </AccordionItem>
  );
}