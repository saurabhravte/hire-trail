import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { motion, useReducedMotion } from "motion/react";
import { HalfMoon, SunLight, Xmark } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGreeting } from "../hooks/use-greeting";
import { getShowWelcome, WELCOME_PREF_EVENT } from "../welcome-preference";

const dismissKey = (uid: string) => `hiretrail:welcome-dismissed:${uid}`;

export function WelcomeCard({ contextLine }: { contextLine?: string }) {
  const { user, isLoaded } = useUser();
  const reduce = useReducedMotion();
  const [prefOn, setPrefOn] = useState(getShowWelcome);
  const [dismissed, setDismissed] = useState(false);

  const uid = user?.id ?? null;
  const { window: tw, greeting, message } = useGreeting(user?.firstName ?? "");

  // Keep in sync with the Settings toggle.
  useEffect(() => {
    const sync = () => setPrefOn(getShowWelcome());
    window.addEventListener(WELCOME_PREF_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WELCOME_PREF_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Per-user, per-session dismissal (shows again after a new login).
  useEffect(() => {
    if (!uid) return;
    try {
      setDismissed(sessionStorage.getItem(dismissKey(uid)) === "1");
    } catch {
      /* ignore */
    }
  }, [uid]);

  const dismiss = () => {
    setDismissed(true);
    if (uid) {
      try {
        sessionStorage.setItem(dismissKey(uid), "1");
      } catch {
        /* ignore */
      }
    }
  };

  if (!prefOn || dismissed) return null;

  if (!isLoaded) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
    );
  }

  const Icon = tw === "evening" || tw === "night" || tw === "midnight" ? HalfMoon : SunLight;

  return (
    <motion.section
      role="status"
      aria-live="polite"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-lg border bg-card p-4 pr-10"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 space-y-0.5">
          <h2 className="font-heading text-base font-semibold tracking-tight">{greeting}</h2>
          <p className="text-sm text-muted-foreground">{contextLine ?? message}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={dismiss}
        aria-label="Dismiss welcome message"
        className="absolute right-2 top-2"
      >
        <Xmark className="size-4" />
      </Button>
    </motion.section>
  );
}