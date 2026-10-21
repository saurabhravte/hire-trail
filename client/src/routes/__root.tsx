import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ApiTokenBridge } from "@/components/providers/api-token-bridge";
import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { NotFound } from "@/components/shared/not-found";
import { FullScreenSpinner } from "@/components/shared/full-screen-spinner";
import { OfflineBanner } from "@/components/shared/offline-banner";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
  pendingComponent: FullScreenSpinner,
  errorComponent: () => <NotFound />,
});

function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ApiTokenBridge />
        <TooltipProvider delayDuration={200}>
          <OfflineBanner />
          <Outlet />
        </TooltipProvider>
        <Toaster richColors closeButton position="top-right" />
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      </QueryProvider>
    </ErrorBoundary>
  );
}