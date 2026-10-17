import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}