import { env } from "@/config/env";

/** Fire-and-forget ping so a cold backend starts waking on first page load. */
export function warmUpServer(): void {
  try {
    const base = env.apiBaseUrl.replace(/\/api\/v1\/?$/, "");
    void fetch(`${base}/api/health`, { method: "GET" }).catch(() => undefined);
  } catch {
    /* ignore */
  }
}