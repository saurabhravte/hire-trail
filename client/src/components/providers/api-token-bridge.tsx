import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { setTokenGetter } from "@/lib/api-client";

export function ApiTokenBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(() => getToken());
    return () => setTokenGetter(null);
  }, [getToken]);

  return null;
}