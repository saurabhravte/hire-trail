import { Briefcase } from "lucide-react";
import { NAV_LINKS } from "../constants";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function LandingFooter() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Briefcase className="size-3.5" />
          </span>
          <span className="font-heading text-sm font-semibold">HireTrail</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToId(link.id)}
              className="rounded-md px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireTrail
        </p>
      </div>
    </footer>
  );
}