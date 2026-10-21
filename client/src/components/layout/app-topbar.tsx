import { Link } from "@tanstack/react-router";
import { UserButton } from "@clerk/react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPanel } from "@/features/notifications/components/notifications-panel";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />

      {/* Terminal breadcrumb */}
      <div className="hidden items-center gap-2 font-mono text-xs text-muted-foreground sm:flex">
        <span className="transition-colors hover:text-foreground">workspace</span>
        <span className="text-border">/</span>
        <span className="font-medium text-foreground">candidate-tracker</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Command-style search affordance */}
        <button
          type="button"
          className="hidden items-center gap-2 rounded-sm border border-border bg-muted/40 px-2.5 py-1 text-muted-foreground transition-colors hover:border-ring/40 md:flex"
        >
          <Search className="size-3.5 text-muted-foreground" />
          <span className="text-xs">Search</span>
          <span className="rounded-[3px] border border-border bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </span>
        </button>

        <NotificationsPanel />
        <ModeToggle />

        <Button asChild size="sm" className="gap-1.5 font-medium">
          <Link to="/applications" search={{ create: "quick" }}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Candidate</span>
          </Link>
        </Button>

        <Separator orientation="vertical" className="mx-0.5 h-5" />
        <UserButton />
      </div>
    </header>
  );
}
