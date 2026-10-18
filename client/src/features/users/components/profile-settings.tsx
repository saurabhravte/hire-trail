import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useTheme } from "@/components/providers/theme-provider";
import { getLocalTimezone, listTimezones } from "@/lib/datetime";
import type { UserProfile } from "../types";
import { useUpdateProfile } from "../hooks/use-profile";

interface FormValues {
  displayName: string;
  timezone: string;
  theme: "light" | "dark" | "system";
  dateFormat: string;
}

const DATE_FORMATS = [
  { value: "yyyy-MM-dd", label: "2026-10-17" },
  { value: "d MMM yyyy", label: "17 Oct 2026" },
  { value: "MM/dd/yyyy", label: "10/17/2026" },
  { value: "dd/MM/yyyy", label: "17/10/2026" },
];

export function ProfileSettings({ profile }: { profile: UserProfile }) {
  const update = useUpdateProfile();
  const { setTheme } = useTheme();

  const timezones = useMemo(() => {
    const all = listTimezones();
    const common = [getLocalTimezone(), "UTC"].filter((v, i, a) => a.indexOf(v) === i);
    return [...common, ...all.filter((tz) => !common.includes(tz))];
  }, []);

  const { control, register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {
      displayName: profile.displayName ?? "",
      timezone: profile.timezone,
      theme: profile.theme,
      dateFormat: profile.dateFormat,
    },
  });

  useEffect(() => {
    reset({
      displayName: profile.displayName ?? "",
      timezone: profile.timezone,
      theme: profile.theme,
      dateFormat: profile.dateFormat,
    });
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await update.mutateAsync({
      displayName: values.displayName.trim() || null,
      timezone: values.timezone,
      theme: values.theme,
      dateFormat: values.dateFormat,
    });
    // Apply the theme immediately so the stored preference and UI agree.
    setTheme(values.theme);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="displayName">Display name</FieldLabel>
            <Input id="displayName" {...register("displayName")} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
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
              <FieldDescription>Used for week boundaries and reminders.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Date format</FieldLabel>
              <Controller
                control={control}
                name="dateFormat"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FORMATS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Theme</FieldLabel>
            <Controller
              control={control}
              name="theme"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="flex justify-end">
            <Button type="submit" disabled={update.isPending || !formState.isDirty}>
              {update.isPending && <Spinner className="size-4" />}
              Save profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}