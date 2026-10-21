import { Link } from "@tanstack/react-router";
import { Plus } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPanel } from "@/features/notifications/components/notifications-panel";
import { SearchCommand } from "@/features/search/components/search-command";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />

      <div className="hidden items-center gap-2 font-mono text-xs text-muted-foreground sm:flex">
        <span className="font-medium text-foreground">applications</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <SearchCommand />
        <NotificationsPanel />
        <ModeToggle />

        <Button asChild size="sm" className="gap-1.5 font-medium">
          <Link to="/applications" search={{ create: "quick" }}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Job</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}