import { useEffect } from "react";
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
import { humanize } from "@/lib/format";
import { useApplicationsList } from "@/features/applications/hooks/use-applications";
import {
  emptyOfferValues,
  NONE,
  OFFER_DECISIONS,
  offerFormSchema,
  PAY_PERIODS,
  toOfferFormValues,
  toOfferPayload,
  WORK_MODES,
  type OfferFormValues,
} from "../schemas/offer-form.schema";
import { useCreateOffer, useUpdateOffer } from "../hooks/use-offer-mutations";
import type { Offer } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer;
}

export function OfferFormDialog({ open, onOpenChange, offer }: Props) {
  const isEdit = Boolean(offer);
  const create = useCreateOffer();
  const update = useUpdateOffer();

  const appsQuery = useApplicationsList({ archived: "all", pageSize: 100, sort: "updatedAt", dir: "desc" });
  const apps = appsQuery.data?.data ?? [];

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: emptyOfferValues(),
  });

  useEffect(() => {
    if (open) reset(offer ? toOfferFormValues(offer) : emptyOfferValues());
  }, [open, offer, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = toOfferPayload(values);
    if (isEdit && offer) await update.mutateAsync({ id: offer.id, payload });
    else await create.mutateAsync(payload);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b p-4">
          <DialogTitle>{isEdit ? "Edit offer" : "Add offer"}</DialogTitle>
          <DialogDescription>Compensation is stored with its own currency and period.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex max-h-[calc(90vh-8.5rem)] flex-col">
          <div className="grid gap-4 overflow-y-auto p-4 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <FieldLabel>Application *</FieldLabel>
              <Controller
                control={control}
                name="applicationId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isEdit}>
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

            <Field>
              <FieldLabel htmlFor="basePay">Base pay</FieldLabel>
              <Input id="basePay" inputMode="decimal" {...register("basePay")} aria-invalid={!!errors.basePay} />
              <FieldError>{errors.basePay?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="variablePay">Variable pay</FieldLabel>
              <Input id="variablePay" inputMode="decimal" {...register("variablePay")} aria-invalid={!!errors.variablePay} />
              <FieldError>{errors.variablePay?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="bonus">Bonus</FieldLabel>
              <Input id="bonus" inputMode="decimal" {...register("bonus")} aria-invalid={!!errors.bonus} />
              <FieldError>{errors.bonus?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Input id="currency" placeholder="INR, USD…" {...register("currency")} />
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
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input id="location" {...register("location")} />
            </Field>
            <Field>
              <FieldLabel>Decision</FieldLabel>
              <Controller
                control={control}
                name="decision"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OFFER_DECISIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {humanize(d)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="joiningDate">Joining date</FieldLabel>
              <Input id="joiningDate" type="date" {...register("joiningDate")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="deadline">Offer deadline</FieldLabel>
              <Input id="deadline" type="date" {...register("deadline")} />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="equityNotes">Equity notes</FieldLabel>
              <Textarea id="equityNotes" rows={2} {...register("equityNotes")} />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="benefits">Benefits</FieldLabel>
              <Textarea id="benefits" rows={2} {...register("benefits")} />
            </Field>
          </div>

          <DialogFooter className="border-t p-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="size-4" />}
              {isEdit ? "Save" : "Add offer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}