import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import {
  emptyResumeValues,
  resumeFormSchema,
  toResumeFormData,
  toResumeFormValues,
  validateFile,
  type ResumeFormValues,
} from "../schemas/resume-form.schema";
import { useCreateResume, useUpdateResume } from "../hooks/use-resume-mutations";
import type { ResumeVersion } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume?: ResumeVersion;
}

export function ResumeFormDialog({ open, onOpenChange, resume }: Props) {
  const isEdit = Boolean(resume);
  const create = useCreateResume();
  const update = useUpdateResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: emptyResumeValues,
  });

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setFile(null);
      setFileError(null);
    }
  }

  useEffect(() => {
    if (open) {
      reset(resume ? toResumeFormValues(resume) : emptyResumeValues);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open, resume, reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      const err = validateFile(selected);
      setFileError(err);
      setFile(err ? null : selected);
    } else {
      setFile(null);
      setFileError(null);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (fileError) return;
    const form = toResumeFormData(values, file);
    if (isEdit && resume) await update.mutateAsync({ id: resume.id, form });
    else await create.mutateAsync(form);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit resume" : "Add resume"}</DialogTitle>
          <DialogDescription>Files are stored privately; links expire after a few minutes.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="label">Label *</FieldLabel>
            <Input id="label" placeholder="e.g. Backend v3" {...register("label")} aria-invalid={!!errors.label} />
            <FieldError>{errors.label?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="resumeFile">
              {isEdit ? "Replace file (optional)" : "File (optional)"}
            </FieldLabel>
            <input
              ref={fileInputRef}
              id="resumeFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={onFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start font-normal"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-4" />
              {file ? file.name : resume?.fileName ? `Current: ${resume.fileName}` : "Choose PDF, DOC or DOCX"}
            </Button>
            {fileError ? (
              <FieldError>{fileError}</FieldError>
            ) : (
              <FieldDescription>Max 5 MB.</FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="coverLetterUrl">Cover letter link</FieldLabel>
            <Input id="coverLetterUrl" {...register("coverLetterUrl")} />
          </Field>

          <Field>
            <FieldLabel htmlFor="portfolioUrl">Portfolio link</FieldLabel>
            <Input id="portfolioUrl" {...register("portfolioUrl")} />
          </Field>

          <Field>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </Field>

          <Field orientation="horizontal">
            <Controller
              control={control}
              name="isDefault"
              render={({ field }) => (
                <Switch id="isDefault" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <FieldLabel htmlFor="isDefault">Set as default resume</FieldLabel>
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !!fileError}>
              {isSubmitting && <Spinner className="size-4" />}
              {isEdit ? "Save" : "Add resume"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}