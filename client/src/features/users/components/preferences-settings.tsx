import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import type { UserProfile } from "../types";
import { useUpdatePreferences } from "../hooks/use-profile";
import { WelcomeMessageToggle } from "@/features/dashboard/components/welcome-message-toggle";

interface FormValues {
  followUpThresholdDays: number;
  ghostedReviewThresholdDays: number;
  notifyInterviews: boolean;
  notifyFollowUps: boolean;
}

export function PreferencesSettings({ profile }: { profile: UserProfile }) {
  const update = useUpdatePreferences();
  const { control, register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {
      followUpThresholdDays: profile.preferences.followUpThresholdDays,
      ghostedReviewThresholdDays: profile.preferences.ghostedReviewThresholdDays,
      notifyInterviews: profile.preferences.notifyInterviews,
      notifyFollowUps: profile.preferences.notifyFollowUps,
    },
  });

  useEffect(() => {
    reset({
      followUpThresholdDays: profile.preferences.followUpThresholdDays,
      ghostedReviewThresholdDays: profile.preferences.ghostedReviewThresholdDays,
      notifyInterviews: profile.preferences.notifyInterviews,
      notifyFollowUps: profile.preferences.notifyFollowUps,
    });
  }, [profile, reset]);

  const onSubmit = handleSubmit((values) =>
    update.mutate({
      followUpThresholdDays: Number(values.followUpThresholdDays),
      ghostedReviewThresholdDays: Number(values.ghostedReviewThresholdDays),
      notifyInterviews: values.notifyInterviews,
      notifyFollowUps: values.notifyFollowUps,
    }),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Reminders & preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="followUpThresholdDays">Follow-up threshold (days)</FieldLabel>
              <Input
                id="followUpThresholdDays"
                type="number"
                min={1}
                max={365}
                {...register("followUpThresholdDays")}
              />
              <FieldDescription>Suggest a follow-up after this many days.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="ghostedReviewThresholdDays">Ghosted-review threshold (days)</FieldLabel>
              <Input
                id="ghostedReviewThresholdDays"
                type="number"
                min={1}
                max={365}
                {...register("ghostedReviewThresholdDays")}
              />
              <FieldDescription>Review no-response applications after this long.</FieldDescription>
            </Field>
          </div>

          <Field orientation="horizontal">
            <Controller
              control={control}
              name="notifyInterviews"
              render={({ field }) => (
                <Switch id="notifyInterviews" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <FieldContent>
              <FieldLabel htmlFor="notifyInterviews">Interview reminders</FieldLabel>
              <FieldDescription>Show in-app reminders for upcoming interviews.</FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <Controller
              control={control}
              name="notifyFollowUps"
              render={({ field }) => (
                <Switch id="notifyFollowUps" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <FieldContent>
              <FieldLabel htmlFor="notifyFollowUps">Follow-up reminders</FieldLabel>
              <FieldDescription>Show in-app reminders for due tasks.</FieldDescription>
            </FieldContent>
          </Field>

          <WelcomeMessageToggle />
          <div className="flex justify-end">
            <Button type="submit" disabled={update.isPending || !formState.isDirty}>
              {update.isPending && <Spinner className="size-4" />}
              Save preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}