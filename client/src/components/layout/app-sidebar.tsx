import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronsUpDown, Flame, LogOut, Search, Settings as SettingsIcon, User } from "lucide-react";
import { useClerk, useUser } from "@clerk/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_GROUPS } from "@/constants/navigation";
import { searchPalette } from "@/features/search/use-search-palette";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initials =
    ((user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")).trim() ||
    email[0] ||
    "U";
  const name = user?.fullName ?? "You";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-2 border-b border-sidebar-border/60 pb-3">
        <div className="flex items-center gap-2 px-1 pt-1">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary font-mono text-[13px] font-bold text-primary-foreground">
            H
          </span>
          <span className="font-heading text-sm font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            HireTrail
          </span>
        </div>

        {/* Search affordance with ⌘K hint (opens the command palette). */}
        <button
          type="button"
          onClick={() => searchPalette.open()}
          className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-background/40 px-2.5 py-1.5 text-left text-muted-foreground transition-colors hover:border-ring/40 group-data-[collapsible=icon]:hidden"
          aria-label="Search applications"
        >
          <Search className="size-3.5" />
          <span className="flex-1 text-xs">Search…</span>
          <span className="rounded-[4px] border border-sidebar-border bg-muted px-1 py-0.5 font-mono text-[10px]">
            ⌘K
          </span>
        </button>

        {/* Streak card — applications-sent streak. */}
        <div className="flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-card px-2.5 py-2 group-data-[collapsible=icon]:hidden">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[color:var(--signal-amber)]/12 text-[color:var(--signal-amber)]">
            <Flame className="size-4" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold">4 day streak</p>
            <p className="text-[11px] text-muted-foreground">Keep applying daily</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="label-section">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.to || pathname.startsWith(`${item.to}/`);
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="rounded-lg"
                      >
                        <Link to={item.to}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-sidebar-border bg-card p-2 text-left transition-colors hover:border-ring/40 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-1"
            >
              <span className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-[11px] font-semibold">
                  {initials.toUpperCase()}
                </span>
                <span className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-xs font-medium">{name}</span>
                  {email && (
                    <span className="truncate font-mono text-[10px] text-muted-foreground">
                      {email}
                    </span>
                  )}
                </span>
              </span>
              <ChevronsUpDown className="size-3.5 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <User /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <SettingsIcon /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => signOut(() => navigate({ to: "/" }))}
            >
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
