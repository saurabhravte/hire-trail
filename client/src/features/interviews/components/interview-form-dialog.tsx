import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { INTERVIEW_OUTCOMES, INTERVIEW_ROUNDS, INTERVIEW_STATUSES } from "@/constants/enums";
import {
  DURATION_OPTIONS,
  INTERVIEW_STATUS_CONFIG,
  OUTCOME_LABELS,
  ROUND_LABELS,
} from "@/constants/interview";
import { getLocalTimezone, listTimezones } from "@/lib/datetime";
import { useApplicationsList } from "@/features/applications/hooks/use-applications";
import {
  emptyInterviewValues,
  interviewFormSchema,
  toInterviewFormValues,
  toInterviewPayload,
  type InterviewFormValues,
} from "../schemas/interview-form.schema";
import {
  useCreateInterview,
  useUpdateInterview,
} from "../hooks/use-interview-mutations";
import type { Interview } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview?: Interview;
  applicationId?: string; // pre-bound (from application detail)
  defaultDate?: string; // yyyy-MM-dd (from clicking a calendar day)
}

// Common timezones first, then the rest — keeps the select usable.
function useTimezoneOptions() {
  return useMemo(() => {
    const all = listTimezones();
    const local = getLocalTimezone();
    const common = [local, "UTC"].filter((v, i, a) => a.indexOf(v) === i);
    const rest = all.filter((tz) => !common.includes(tz));
    return [...common, ...rest];
  }, []);
}

export function InterviewFormDialog({
  open,
  onOpenChange,
  interview,
  applicationId,
  defaultDate,
}: Props) {
  const isEdit = Boolean(interview);
  const showAppPicker = !isEdit && !applicationId;
  const timezones = useTimezoneOptions();

  const appsQuery = useApplicationsList({ archived: "false", pageSize: 100, sort: "updatedAt", dir: "desc" });
  const apps = appsQuery.data?.data ?? [];

  const create = useCreateInterview();
  const update = useUpdateInterview();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: emptyInterviewValues(),
  });

  useEffect(() => {
    if (open) {
      reset(
        interview
          ? toInterviewFormValues(interview)
          : emptyInterviewValues(applicationId ?? "", defaultDate),
      );
    }
  }, [open, interview, applicationId, defaultDate, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = toInterviewPayload(values);
    if (isEdit && interview) {
      await update.mutateAsync({ id: interview.id, payload });
    } else {
      await create.mutateAsync({ applicationId: values.applicationId, payload });
    }
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b p-4">
          <DialogTitle>{isEdit ? "Edit interview" : "Schedule interview"}</DialogTitle>
          <DialogDescription>Times are stored in UTC and shown in the chosen timezone.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex max-h-[calc(90vh-8.5rem)] flex-col">
          <div className="grid gap-4 overflow-y-auto p-4 sm:grid-cols-2">
            {showAppPicker && (
              <Field className="sm:col-span-2">
                <FieldLabel>Application *</FieldLabel>
                <Controller
                  control={control}
                  name="applicationId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" aria-invalid={!!errors.applicationId}>
                        <SelectValue placeholder="Select an application" />
                      </SelectTrigger>
                      <SelectContent>
                        {apps.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.companyName ?? "—"} · {a.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.applicationId?.message}</FieldError>
              </Field>
            )}

            <Field>
              <FieldLabel>Round</FieldLabel>
              <Controller
                control={control}
                name="roundType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_ROUNDS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROUND_LABELS[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {INTERVIEW_STATUS_CONFIG[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="startLocal">Start *</FieldLabel>
              <Input
                id="startLocal"
                type="datetime-local"
                {...register("startLocal")}
                aria-invalid={!!errors.startLocal}
              />
              <FieldError>{errors.startLocal?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Duration</FieldLabel>
              <Controller
                control={control}
                name="durationMinutes"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field className="sm:col-span-2">
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

            <Field>
              <FieldLabel htmlFor="meetingLink">Meeting link</FieldLabel>
              <Input id="meetingLink" {...register("meetingLink")} aria-invalid={!!errors.meetingLink} />
              <FieldError>{errors.meetingLink?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input id="location" {...register("location")} placeholder="Office, video call…" />
            </Field>

            <Field>
              <FieldLabel htmlFor="interviewer">Interviewer</FieldLabel>
              <Input id="interviewer" {...register("interviewer")} />
            </Field>

            <Field>
              <FieldLabel>Outcome</FieldLabel>
              <Controller
                control={control}
                name="outcome"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_OUTCOMES.map((o) => (
                        <SelectItem key={o} value={o}>
                          {OUTCOME_LABELS[o]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="questions">Questions asked</FieldLabel>
              <Textarea id="questions" rows={2} {...register("questions")} />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="prepNotes">Preparation notes</FieldLabel>
              <Textarea id="prepNotes" rows={3} {...register("prepNotes")} />
            </Field>
          </div>

          <DialogFooter className="border-t p-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="size-4" />}
              {isEdit ? "Save changes" : "Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}