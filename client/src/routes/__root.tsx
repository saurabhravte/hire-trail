import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ApiTokenBridge } from "@/components/providers/api-token-bridge";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  return (
    <QueryProvider>
      <ApiTokenBridge />
      <Outlet />
      <Toaster richColors closeButton position="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </QueryProvider>
  );
}