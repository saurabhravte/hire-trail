import { Briefcase } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function FullScreenSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Briefcase className="size-6" />
      </span>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        {label}
      </div>
    </div>
  );
}