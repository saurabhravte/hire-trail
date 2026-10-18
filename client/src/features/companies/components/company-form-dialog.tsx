import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Spinner } from "@/components/ui/spinner";
import {
  companyFormSchema,
  emptyCompanyValues,
  toCompanyFormValues,
  toCompanyPayload,
  type CompanyFormValues,
} from "../schemas/company-form.schema";
import { useCreateCompany, useUpdateCompany } from "../hooks/use-company-mutations";
import type { Company } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company;
}

export function CompanyFormDialog({ open, onOpenChange, company }: Props) {
  const isEdit = Boolean(company);
  const create = useCreateCompany();
  const update = useUpdateCompany();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: emptyCompanyValues,
  });

  useEffect(() => {
    if (open) reset(company ? toCompanyFormValues(company) : emptyCompanyValues);
  }, [open, company, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = toCompanyPayload(values);
    if (isEdit && company) await update.mutateAsync({ id: company.id, payload });
    else await create.mutateAsync(payload);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit company" : "Add company"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Name *</FieldLabel>
            <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="website">Website</FieldLabel>
            <Input id="website" placeholder="https://…" {...register("website")} aria-invalid={!!errors.website} />
            <FieldError>{errors.website?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea id="notes" rows={3} {...register("notes")} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="size-4" />}
              {isEdit ? "Save" : "Add company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}