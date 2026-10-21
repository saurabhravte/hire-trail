import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Xmark } from "iconoir-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { StatusBadge } from "@/components/shared/status-badge";
import { useApplicationsList } from "@/features/applications/hooks/use-applications";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const query = useDebounce(input, 300);
  const navigate = useNavigate();

  // ⌘K / Ctrl+K to open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Searches company, role and status server-side.
  const { data } = useApplicationsList({
    q: query || undefined,
    archived: "all",
    pageSize: 8,
    sort: "updatedAt",
    dir: "desc",
    page: 1,
  });
  const results = query ? (data?.data ?? []) : [];

  const goTo = (id: string) => {
    setOpen(false);
    setInput("");
    navigate({ to: "/applications/$id", params: { id } });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-sm border border-border bg-muted/40 px-2.5 py-1 text-muted-foreground transition-colors hover:border-ring/40"
        aria-label="Search applications"
      >
        <Search className="size-4 text-muted-foreground" />
        <span className="hidden text-xs sm:inline">Search</span>
        <span className="hidden rounded-[3px] border border-border bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
          ⌘K
        </span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="relative">
          <CommandInput
            placeholder="Search by company, role or status…"
            value={input}
            onValueChange={setInput}
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Xmark className="size-4" />
            </button>
          )}
        </div>
        <CommandList>
          {query && results.length === 0 && (
            <CommandEmpty>No jobs match “{query}”.</CommandEmpty>
          )}
          {results.length > 0 && (
            <CommandGroup heading="Applications">
              {results.map((app) => (
                <CommandItem
                  key={app.id}
                  value={`${app.companyName ?? ""} ${app.role} ${app.status}`}
                  onSelect={() => goTo(app.id)}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">
                      {app.companyName ?? "—"} · {app.role}
                    </span>
                  </span>
                  <StatusBadge status={app.status} />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}