import { useEffect } from "react";
import { WifiOff } from "iconoir-react";
import { useQueryClient } from "@tanstack/react-query";
import { useOnline } from "@/hooks/use-online";

export function OfflineBanner() {
  const online = useOnline();
  const qc = useQueryClient();

  // Auto-retry queries on reconnect.
  useEffect(() => {
    if (online) qc.invalidateQueries();
  }, [online, qc]);

  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-destructive/90 px-4 py-1.5 text-center text-xs font-medium text-white backdrop-blur"
    >
      <WifiOff className="size-4" />
      You’re offline. We’ll retry automatically when you reconnect.
    </div>
  );
}