import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DataState } from "@/components/shared/data-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatPercent } from "@/lib/format";
import { usePlatforms } from "../hooks/use-platforms";
import {
  useCreatePlatform,
  useDeletePlatform,
  useUpdatePlatform,
} from "../hooks/use-platform-mutations";
import type { Platform } from "../types";

export function PlatformsSettings() {
  const { data, isLoading, isError, error, refetch } = usePlatforms();
  const create = useCreatePlatform();
  const update = useUpdatePlatform();
  const remove = useDeletePlatform();
  const [newName, setNewName] = useState("");
  const [toDelete, setToDelete] = useState<Platform | null>(null);

  const add = () => {
    const name = newName.trim();
    if (!name) return;
    create.mutate(name, { onSuccess: () => setNewName("") });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Platforms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder="Add a platform (e.g. AngelList)"
          />
          <Button onClick={add} disabled={create.isPending || !newName.trim()}>
            <Plus /> Add
          </Button>
        </div>

        <DataState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          isEmpty={(data ?? []).length === 0}
          emptyTitle="No platforms"
        >
          <ul className="divide-y rounded-lg border">
            {data?.map((platform) => (
              <li key={platform.id} className="flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{platform.name}</span>
                    {platform.isSystem && (
                      <Badge variant="secondary" className="h-4 text-[10px]">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {platform.applicationCount} app{platform.applicationCount === 1 ? "" : "s"} ·{" "}
                    {formatPercent(platform.responseRate)} response
                  </p>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Switch
                    checked={platform.isActive}
                    onCheckedChange={(checked) =>
                      update.mutate({ id: platform.id, patch: { isActive: checked } })
                    }
                    aria-label={`Toggle ${platform.name}`}
                  />
                  Active
                </label>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${platform.name}`}
                  onClick={() => setToDelete(platform)}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        </DataState>
      </CardContent>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`Delete ${toDelete?.name}?`}
        description="Applications using this platform keep their other details but lose the platform link."
        confirmLabel="Delete"
        destructive
        onConfirm={() => toDelete && remove.mutate(toDelete.id)}
      />
    </Card>
  );
}