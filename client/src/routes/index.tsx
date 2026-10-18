import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@clerk/react";
import { Spinner } from "@/components/ui/spinner";
import { LandingPage } from "@/features/landing/components/landing-page";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isSignedIn) return <Navigate to="/dashboard" />;

  return <LandingPage />;
}