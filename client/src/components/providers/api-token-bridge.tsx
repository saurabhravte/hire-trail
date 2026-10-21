import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { setTokenGetter, setUnauthorizedHandler } from "@/lib/api-client";

export function ApiTokenBridge() {
  const { getToken, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTokenGetter(() => getToken());
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