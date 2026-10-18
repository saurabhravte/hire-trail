import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { TaskFormDialog } from "@/features/tasks/components/task-form-dialog";
import { TaskItem } from "@/features/tasks/components/task-item";
import type { Task, TaskFilter } from "@/features/tasks/types";

export const Route = createFileRoute("/_app/tasks")({ component: TasksPage });

type Tab = TaskFilter | "completed";

function TasksPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | undefined>();

  const params =
    tab === "completed"
      ? { state: "completed" as const }
      : { filter: tab, state: tab === "all" ? undefined : ("pending" as const) };

  const { data, isLoading, isError, error, refetch } = useTasks(params);
  const tasks = data ?? [];

  const openNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditing(task);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reminders & Tasks"
        description="Follow-ups and to-dos across your job search."
        actions={
          <Button onClick={openNew}>
            <Plus /> Add task
          </Button>
        }
      />

      <ToggleGroup
        type="single"
        value={tab}
        onValueChange={(v) => v && setTab(v as Tab)}
        variant="outline"
        size="sm"
        spacing={0}
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="upcoming">Upcoming</ToggleGroupItem>
        <ToggleGroupItem value="overdue">Overdue</ToggleGroupItem>
        <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
      </ToggleGroup>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={tasks.length === 0}
        emptyTitle="No tasks here"
        emptyDescription={
          tab === "overdue"
            ? "Nothing overdue — nice work."
            : "Add a follow-up task to stay on top of things."
        }
        emptyAction={
          <Button variant="outline" size="sm" onClick={openNew}>
            <ListChecks /> Add task
          </Button>
        }
        loadingFallback={
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        }
      >
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={openEdit} />
          ))}
        </div>
      </DataState>

      <TaskFormDialog open={formOpen} onOpenChange={setFormOpen} task={editing} />
    </div>
  );
}