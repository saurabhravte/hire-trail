import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@clerk/react";
import { AppShell } from "@/components/layout/app-shell";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/" />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}