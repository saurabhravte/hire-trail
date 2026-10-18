import { useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useApplicationTasks } from "../hooks/use-tasks";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskItem } from "./task-item";
import type { Task } from "../types";

export function ApplicationTasksSection({ applicationId }: { applicationId: string }) {
  const { data, isLoading, isError, error, refetch } = useApplicationTasks(applicationId);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | undefined>();

  const openNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditing(task);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Follow-up tasks</CardTitle>
        <Button size="xs" variant="outline" onClick={openNew}>
          <Plus /> Add task
        </Button>
      </CardHeader>
      <CardContent>
        <DataState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          isEmpty={(data ?? []).length === 0}
          emptyTitle=""
        >
          {data && data.length > 0 ? (
            <div className="space-y-2">
              {data.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={openEdit} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ListChecks />}
              title="No tasks yet"
              description="Add follow-ups for this application."
            />
          )}
        </DataState>
      </CardContent>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        applicationId={applicationId}
        task={editing}
      />
    </Card>
  );
}