import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SignInButton, SignUpButton, useAuth } from "@clerk/react";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Briefcase className="size-6" />
      </span>
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">HireTrail</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Organize your job search, track applications and interviews, and see what’s working.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <SignInButton mode="modal">
          <Button variant="outline">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Get started</Button>
        </SignUpButton>
      </div>
    </div>
  );
}