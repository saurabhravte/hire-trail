import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsUpDown } from "lucide-react";
import { useUser } from "@clerk/react";
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
import { NAV_GROUPS } from "@/constants/navigation";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useUser();

  const initials =
    (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") || "U";
  const name = user?.fullName ?? "You";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <div className="flex items-center justify-between gap-2 px-1 py-1">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-sm border border-border bg-muted font-mono text-[13px] font-semibold text-primary">
              H
            </span>
            <span className="font-heading text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              HireTrail
            </span>
            <span className="size-1.5 rounded-full bg-primary group-data-[collapsible=icon]:hidden" />
          </div>
          <span className="rounded-sm border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
            v2.4
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="label-mono text-[10px]">
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
                        className="data-active:border-l-2 data-active:border-primary data-active:rounded-l-sm"
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              isActive={pathname.startsWith("/settings")}
            >
              <Link to="/settings">
                <ChevronsUpDown className="opacity-0" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center justify-between rounded-sm border border-border bg-muted/40 p-2 transition-colors hover:border-ring/40 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-sm border border-border bg-muted font-mono text-[10px] font-semibold text-primary">
              {initials.toUpperCase()}
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium">{name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                Talent Lead
              </span>
            </div>
          </div>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
