import { Link } from "@tanstack/react-router";
import { Flame, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPanel } from "@/features/notifications/components/notifications-panel";
import { SearchCommand } from "@/features/search/components/search-command";
import { useStreak } from "@/features/analytics/hooks/use-streak";

export function AppTopbar() {
  const { data: streak } = useStreak();
  const days = streak?.current ?? 0;

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />

      <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm sm:flex">
        <Link
          to="/dashboard"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <span className="text-muted-foreground/50">›</span>
        <span className="font-medium text-foreground">Applications</span>
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <SearchCommand />

        {/* Live streak counter. */}
        {days > 0 && (
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-[color:var(--signal-amber)] sm:inline-flex">
            <Flame className="size-3.5" />
            {days}
          </span>
        )}

        <NotificationsPanel />
        <ModeToggle />

        <Button asChild size="sm" className="gap-1.5 rounded-lg font-medium">
          <Link to="/applications" search={{ create: "quick" }}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Job</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
