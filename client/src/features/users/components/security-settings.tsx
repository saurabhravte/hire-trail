import { UserProfile } from "@clerk/react";
import { useTheme } from "@/components/providers/theme-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SecuritySettings() {
  const { theme } = useTheme();
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Account &amp; password</CardTitle>
      </CardHeader>
      <CardContent>
        <UserProfile
          routing="hash"
          appearance={{
            baseTheme: dark ? undefined : undefined, // keep Clerk default; variables below align it
            variables: {
              colorPrimary: "oklch(0.696 0.154 162.5)",
              fontFamily: '"Manrope Variable", sans-serif',
            },
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none border-0",
            },
          }}
        />
      </CardContent>
    </Card>
  );
}