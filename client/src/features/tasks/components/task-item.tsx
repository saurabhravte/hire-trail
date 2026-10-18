import { useState } from "react";
import { parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { cn } from "@/lib/utils";
import { formatWhen } from "@/lib/datetime";
import { humanize } from "@/lib/format";
import { useDeleteTask, useToggleTask } from "../hooks/use-task-mutations";
import type { Task } from "../types";

const PRIORITY_DOT: Record<string, string> = {
  low: "bg-slate-400",
  normal: "bg-blue-500",
  high: "bg-rose-500",
};

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: Props) {
  const [confirm, setConfirm] = useState(false);
  const toggle = useToggleTask();
  const remove = useDeleteTask();

  const isCompleted = task.state === "completed";
  const isOverdue =
    !isCompleted && task.dueTime != null && parseISO(task.dueTime).getTime() < Date.now();

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3 transition-colors",
        isOverdue && "border-rose-500/30 bg-rose-500/5",
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={(c) =>
          toggle.mutate({ id: task.id, complete: c === true, applicationId: task.applicationId })
        }
        className="mt-0.5"
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", isCompleted && "text-muted-foreground line-through")}>
          {task.title}
        </p>
        {task.description && (
          <p className="truncate text-xs text-muted-foreground">{task.description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className={cn("size-1.5 rounded-full", PRIORITY_DOT[task.priority])} />
            {humanize(task.priority)}
          </span>
          {task.dueTime && (
            <span className={cn(isOverdue && "font-medium text-rose-600 dark:text-rose-400")}>
              {isOverdue ? "Overdue · " : "Due "}
              {formatWhen(task.dueTime, task.timezone)}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button variant="ghost" size="icon-xs" aria-label="Edit task" onClick={() => onEdit(task)}>
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Delete task"
          onClick={() => setConfirm(true)}
        >
          <Trash2 />
        </Button>
      </div>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete this task?"
        description="This removes the task and its reminder."
        confirmLabel="Delete"
        destructive
        onConfirm={() => remove.mutate({ id: task.id, applicationId: task.applicationId })}
      />
    </div>
  );
}