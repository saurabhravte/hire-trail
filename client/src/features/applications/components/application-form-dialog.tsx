import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { humanize } from "@/lib/format";
import { PAY_PERIODS, PRIORITIES, WORK_MODES } from "@/constants/enums";
import { STATUS_OPTIONS } from "@/constants/status";
import { usePlatforms } from "@/features/platforms/hooks/use-platforms";
import { useResumes } from "@/features/resumes/hooks/use-resumes";
import {
  applicationFormSchema,
  emptyFormValues,
  NONE,
  toApiPayload,
  toFormValues,
  type ApplicationFormValues,
} from "../schemas/application-form.schema";
import { useCreateApplication, useUpdateApplication } from "../hooks/use-application-mutations";
import { useDuplicateCheck } from "../hooks/use-duplicate-check";
import type { Application } from "../types";
import { DuplicateWarning } from "./duplicate-warning";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: Application;
  defaultStatus?: ApplicationFormValues["status"];
}

export function ApplicationFormDialog({ open, onOpenChange, application, defaultStatus }: Props) {
  const isEdit = Boolean(application);
  const { data: platforms } = usePlatforms();
  const { data: resumes } = useResumes();
  const create = useCreateApplication();
  const update = useUpdateApplication();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        application
          ? toFormValues(application)
          : { ...emptyFormValues, status: defaultStatus ?? "saved" },
      );
    }
  }, [open, application, defaultStatus, reset]);

  const [companyName, role, jobUrl] = useWatch({ control, name: ["companyName", "role", "jobUrl"] });
  const { matches } = useDuplicateCheck({
    companyName,
    role,
    jobUrl,
    enabled: open && !isEdit,
    excludeId: application?.id,
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload = toApiPayload(values);
    if (isEdit && application) {
      await update.mutateAsync({ id: application.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[100dvh] gap-0 overflow-hidden p-0 sm:max-h-[90vh] sm:max-w-2xl max-sm:h-[100dvh] max-sm:max-w-full max-sm:rounded-none">
        <DialogHeader className="border-b p-4">
          <DialogTitle>{isEdit ? "Edit application" : "Add application"}</DialogTitle>
          <DialogDescription>
            Company and role are required. Everything else is optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex max-h-[calc(90vh-8.5rem)] flex-col">
          <div className="grid gap-4 overflow-y-auto p-4 sm:grid-cols-2">
            {!isEdit && matches.length > 0 && (
              <div className="sm:col-span-2">
                <DuplicateWarning matches={matches} />
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="companyName">Company *</FieldLabel>
              <Input id="companyName" {...register("companyName")} aria-invalid={!!errors.companyName} />
              <FieldError>{errors.companyName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="role">Role *</FieldLabel>
              <Input id="role" {...register("role")} aria-invalid={!!errors.role} />
              <FieldError>{errors.role?.message}</FieldError>
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
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {humanize(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="appliedDate">Applied date</FieldLabel>
              <Input id="appliedDate" type="date" {...register("appliedDate")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input id="location" {...register("location")} placeholder="Remote, Bengaluru…" />
            </Field>

            <Field>
              <FieldLabel htmlFor="salaryMin">Salary min</FieldLabel>
              <Input id="salaryMin" inputMode="decimal" {...register("salaryMin")} aria-invalid={!!errors.salaryMin} />
              <FieldError>{errors.salaryMin?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="salaryMax">Salary max</FieldLabel>
              <Input id="salaryMax" inputMode="decimal" {...register("salaryMax")} aria-invalid={!!errors.salaryMax} />
              <FieldError>{errors.salaryMax?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Input id="currency" {...register("currency")} placeholder="INR, USD…" />
            </Field>

            <Field>
              <FieldLabel>Pay period</FieldLabel>
              <Controller
                control={control}
                name="payPeriod"
                render={({ field }) => (
                  <Select value={field.value || NONE} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>None</SelectItem>
                      {PAY_PERIODS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {humanize(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Work mode</FieldLabel>
              <Controller
                control={control}
                name="workMode"
                render={({ field }) => (
                  <Select value={field.value || NONE} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>None</SelectItem>
                      {WORK_MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {humanize(m)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Platform</FieldLabel>
              <Controller
                control={control}
                name="platformId"
                render={({ field }) => (
                  <Select value={field.value || NONE} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>None</SelectItem>
                      {(platforms ?? []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Resume version</FieldLabel>
              <Controller
                control={control}
                name="resumeVersionId"
                render={({ field }) => (
                  <Select value={field.value || NONE} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>None</SelectItem>
                      {(resumes ?? []).map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.label}
                          {r.isDefault ? " (default)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="techStack">Tech stack (comma-separated)</FieldLabel>
              <Input id="techStack" {...register("techStack")} placeholder="React, Node, Postgres" />
            </Field>

            <Field>
              <FieldLabel htmlFor="jobUrl">Job posting URL</FieldLabel>
              <Input id="jobUrl" {...register("jobUrl")} aria-invalid={!!errors.jobUrl} />
              <FieldError>{errors.jobUrl?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="jobId">Job ID</FieldLabel>
              <Input id="jobId" {...register("jobId")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="recruiterName">Recruiter name</FieldLabel>
              <Input id="recruiterName" {...register("recruiterName")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="recruiterEmail">Recruiter email</FieldLabel>
              <Input id="recruiterEmail" {...register("recruiterEmail")} aria-invalid={!!errors.recruiterEmail} />
              <FieldError>{errors.recruiterEmail?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="recruiterPhone">Recruiter phone</FieldLabel>
              <Input id="recruiterPhone" {...register("recruiterPhone")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="referralPerson">Referral person</FieldLabel>
              <Input id="referralPerson" {...register("referralPerson")} />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="referralNotes">Referral notes</FieldLabel>
              <Textarea id="referralNotes" rows={2} {...register("referralNotes")} />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea id="notes" rows={3} {...register("notes")} />
            </Field>
          </div>

          <DialogFooter className="border-t p-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="size-4" />}
              {isEdit ? "Save changes" : "Add application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}