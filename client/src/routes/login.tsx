import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SignIn, useAuth } from "@clerk/react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FullScreenSpinner } from "@/components/shared/full-screen-spinner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <FullScreenSpinner />;
  if (isSignedIn) return <Navigate to="/dashboard" />;

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your tracker to pick up where you left off.">
      <SignIn
        routing="hash"
        signUpUrl="/get-started"
        afterSignInUrl="/dashboard"
        appearance={{
          variables: { fontFamily: '"Manrope Variable", sans-serif' },
          elements: { rootBox: "mx-auto w-full", cardBox: "w-full shadow-none border-0 bg-transparent" },
        }}
      />
    </AuthShell>
  );
}