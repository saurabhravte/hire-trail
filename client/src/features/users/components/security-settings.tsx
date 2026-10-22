import { UserProfile } from "@clerk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Account &amp; password</CardTitle>
      </CardHeader>
      <CardContent>
        <UserProfile
          routing="hash"
          appearance={{
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