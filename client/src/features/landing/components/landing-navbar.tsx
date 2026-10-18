import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { SignInButton } from "@clerk/react";
import { Briefcase, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "../constants";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function LandingNavbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 24));

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <motion.nav
        className={cn(
          "flex items-center justify-between gap-4 transition-all duration-300 ease-out",
          scrolled
            ? "mt-3 w-[min(64rem,calc(100%-1.5rem))] rounded-full border bg-background/70 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/30"
            : "mt-0 w-full max-w-7xl rounded-none border-transparent bg-transparent px-6 py-4",
        )}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="size-4" />
          </span>
          <span className="font-heading text-sm font-semibold">HireTrail</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => go(link.id)}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <ModeToggle />
          <SignInButton mode="modal">
            <Button size="sm" variant="outline" className="hidden sm:inline-flex">
              Sign in
            </Button>
          </SignInButton>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon-sm" variant="ghost" className="md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => go(link.id)}
                    className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </button>
                ))}
                <SignInButton mode="modal">
                  <Button className="mt-2 w-full">Sign in</Button>
                </SignInButton>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>
    </div>
  );
}