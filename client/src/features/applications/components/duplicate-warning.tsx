import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Application } from "../types";

export function DuplicateWarning({ matches }: { matches: Application[] }) {
  if (matches.length === 0) return null;
  return (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>Possible duplicate</AlertTitle>
      <AlertDescription>
        You may already have{" "}
        {matches.slice(0, 3).map((m, i) => (
          <span key={m.id}>
            {i > 0 && ", "}
            <strong>
              {m.companyName ?? "—"} · {m.role}
            </strong>
          </span>
        ))}
        {matches.length > 3 && ` and ${matches.length - 3} more`}. You can still save if this is
        intentional.
      </AlertDescription>
    </Alert>
  );
}