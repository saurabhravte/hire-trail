import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TASK_PRIORITIES } from "@/constants/enums";
import { getLocalTimezone, listTimezones } from "@/lib/datetime";
import { humanize } from "@/lib/format";
import { useApplicationsList } from "@/features/applications/hooks/use-applications";
import {
  emptyTaskValues,
  NONE,
  taskFormSchema,
  toTaskFormValues,
  toTaskPayload,
  type TaskFormValues,
} from "../schemas/task-form.schema";
import { useCreateTask, useUpdateTask } from "../hooks/use-task-mutations";
import type { Task } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  applicationId?: string; // pre-bound
}

export function TaskFormDialog({ open, onOpenChange, task, applicationId }: Props) {
  const isEdit = Boolean(task);
  const showAppPicker = !applicationId;
  const timezones = useMemo(() => {
    const all = listTimezones();
    const local = getLocalTimezone();
    const common = [local, "UTC"].filter((v, i, a) => a.indexOf(v) === i);
    return [...common, ...all.filter((tz) => !common.includes(tz))];
  }, []);

  const appsQuery = useApplicationsList({ archived: "false", pageSize: 100, sort: "updatedAt", dir: "desc" });
  const apps = appsQuery.data?.data ?? [];

  const create = useCreateTask();
  const update = useUpdateTask();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: emptyTaskValues(),
  });

  useEffect(() => {
    if (open) {
      reset(task ? toTaskFormValues(task) : emptyTaskValues(applicationId));
    }
  }, [open, task, applicationId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = toTaskPayload(values);
    if (isEdit && task) await update.mutateAsync({ id: task.id, payload });
    else await create.mutateAsync(payload);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "Add task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="title">Title *</FieldLabel>
            <Input id="title" {...register("title")} aria-invalid={!!errors.title} />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea id="description" rows={2} {...register("description")} />
          </Field>

          {showAppPicker && (
            <Field>
              <FieldLabel>Related application</FieldLabel>
              <Controller
                control={control}
                name="applicationId"
                render={({ field }) => (
                  <Select value={field.value || NONE} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>None</SelectItem>
                      {apps.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.companyName ?? "—"} · {a.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="dueLocal">Due</FieldLabel>
              <Input id="dueLocal" type="datetime-local" {...register("dueLocal")} />
            </Field>
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {humanize(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Timezone</FieldLabel>
            <Controller
              control={control}
              name="timezone"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="size-4" />}
              {isEdit ? "Save" : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}