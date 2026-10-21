import { useEffect, useState } from "react";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { getShowWelcome, setShowWelcome } from "../welcome-preference";

export function WelcomeMessageToggle() {
  const [on, setOn] = useState(getShowWelcome);
  useEffect(() => setOn(getShowWelcome()), []);
  return (
    <Field orientation="horizontal">
      <Switch
        id="showWelcome"
        checked={on}
        onCheckedChange={(v) => {
          setOn(v);
          setShowWelcome(v);
        }}
      />
      <FieldContent>
        <FieldLabel htmlFor="showWelcome">Show welcome message</FieldLabel>
        <FieldDescription>Display a greeting on the dashboard when you log in.</FieldDescription>
      </FieldContent>
    </Field>
  );
}