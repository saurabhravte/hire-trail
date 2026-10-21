import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary/5 p-10 lg:flex">
        <Link to="/" className="flex w-fit items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="size-4" />
          </span>
          <span className="font-heading text-base font-semibold">HireTrail</span>
        </Link>
        <div className="max-w-sm space-y-3">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Run your job search like a pro.
          </h2>
          <p className="text-sm text-muted-foreground">
            Track every application, interview and offer in one calm workspace.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireTrail
        </span>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="size-3.5" />
            </span>
            <span className="font-heading text-sm font-semibold">HireTrail</span>
          </Link>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1 text-center">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}