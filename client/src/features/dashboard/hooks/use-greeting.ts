import { useEffect, useMemo, useState } from "react";
import {
  GREETINGS,
  pickMessage,
  resolveTimeWindow,
  type TimeWindow,
} from "@/config/greetings";

export function useGreeting(firstName: string) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(() =>
    resolveTimeWindow(new Date()),
  );

  // Re-check every minute so it updates across a time boundary; clean up on unmount.
  useEffect(() => {
    const id = setInterval(() => {
      const next = resolveTimeWindow(new Date());
      setTimeWindow((prev) => (prev === next ? prev : next));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const name = firstName.trim() || "there";
  const message = useMemo(() => pickMessage(timeWindow), [timeWindow]);
  const greeting = GREETINGS[timeWindow].greeting(name);

  return { window: timeWindow, greeting, message };
}