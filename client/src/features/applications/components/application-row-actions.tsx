import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Archive, ArchiveRestore, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useArchiveApplication,
  useDeleteApplication,
} from "../hooks/use-application-mutations";
import type { Application } from "../types";
import { ApplicationFormDialog } from "./application-form-dialog";

export function ApplicationRowActions({ application }: { application: Application }) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const archive = useArchiveApplication();
  const remove = useDeleteApplication();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Row actions" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onSelect={() => navigate({ to: "/applications/$id", params: { id: application.id } })}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => archive.mutate({ id: application.id, archived: !application.isArchived })}
          >
            {application.isArchived ? (
              <>
                <ArchiveRestore /> Restore
              </>
            ) : (
              <>
                <Archive /> Archive
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ApplicationFormDialog open={editOpen} onOpenChange={setEditOpen} application={application} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this application?"
        description="This permanently removes the application and its history. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => remove.mutate(application.id)}
      />
    </>
  );
}