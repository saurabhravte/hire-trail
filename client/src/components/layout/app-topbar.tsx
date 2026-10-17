import { UserButton } from "@clerk/react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell />
        </Button>
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}