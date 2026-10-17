import {
  BarChart3,
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { title: "Applications", to: "/applications", icon: ListChecks },
  { title: "Calendar & Interviews", to: "/interviews", icon: CalendarDays },
  { title: "Reminders & Tasks", to: "/tasks", icon: ScrollText },
  { title: "Analytics", to: "/analytics", icon: BarChart3 },
  { title: "Resumes & Documents", to: "/resumes", icon: FileText },
  { title: "Companies & Contacts", to: "/companies", icon: Building2 },
  { title: "Offers", to: "/offers", icon: FileText },
  { title: "Settings", to: "/settings", icon: Settings },
];