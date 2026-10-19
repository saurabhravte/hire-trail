import {
  BarChart3,
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  Settings,
  Tag,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", to: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Pipeline",
    items: [
      { title: "Applications", to: "/applications", icon: ListChecks },
      { title: "Interviews", to: "/interviews", icon: CalendarDays },
      { title: "Tasks", to: "/tasks", icon: ScrollText },
      { title: "Offers", to: "/offers", icon: Tag },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Resumes", to: "/resumes", icon: FileText },
      { title: "Companies", to: "/companies", icon: Building2 },
      { title: "Settings", to: "/settings", icon: Settings },
    ],
  },
];

/** Flat list retained for any consumer that still imports NAV_ITEMS. */
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
