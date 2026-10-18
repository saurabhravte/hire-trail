import { useState } from "react";
import { Archive, ArchiveRestore, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useBulkAction } from "../hooks/use-application-mutations";

interface Props {
  ids: string[];
  onClear: () => void;
}

export function BulkActionBar({ ids, onClear }: Props) {
  const bulk = useBulkAction();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const run = (action: "archive" | "restore" | "delete") =>
    bulk.mutate({ ids, action }, { onSuccess: onClear });

  if (ids.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-sm">
        <span className="text-sm font-medium">{ids.length} selected</span>
        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={() => run("archive")} disabled={bulk.isPending}>
            <Archive /> Archive
          </Button>
          <Button variant="outline" size="sm" onClick={() => run("restore")} disabled={bulk.isPending}>
            <ArchiveRestore /> Restore
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            disabled={bulk.isPending}
          >
            <Trash2 /> Delete
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onClear} aria-label="Clear selection">
            <X />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete ${ids.length} application${ids.length > 1 ? "s" : ""}?`}
        description="This permanently removes the selected applications and their history."
        confirmLabel="Delete"
        destructive
        onConfirm={() => run("delete")}
      />
    </>
  );
}