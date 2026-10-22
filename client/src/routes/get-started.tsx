import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SignUp, useAuth } from "@clerk/react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FullScreenSpinner } from "@/components/shared/full-screen-spinner";

export const Route = createFileRoute("/get-started")({ component: GetStartedPage });

function GetStartedPage() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <FullScreenSpinner />;
  if (isSignedIn) return <Navigate to="/dashboard" />;

  return (
    <AuthShell title="Get started free" subtitle="Create your account and start tracking in minutes.">
      <SignUp
        routing="hash"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
        appearance={{
          variables: { fontFamily: '"Manrope Variable", sans-serif' },
          elements: { rootBox: "mx-auto w-full", cardBox: "w-full shadow-none border-0 bg-transparent" },
        }}
      />
    </AuthShell>
  );
}