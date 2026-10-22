import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { setTokenGetter, setUnauthorizedHandler } from "@/lib/api-client";

export function ApiTokenBridge() {
  const { getToken, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Forward the skipCache flag so a 401 retry asks Clerk for a fresh token.
    setTokenGetter((opts) => getToken(opts?.skipCache ? { skipCache: true } : undefined));
    return () => setTokenGetter(null);
  }, [getToken]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      const from = window.location.pathname + window.location.search;
      toast.error("Your session expired, please log in again.");
      void signOut(() => navigate({ to: "/", search: { redirect: from } as never }));
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut, navigate]);

  return null;
}
