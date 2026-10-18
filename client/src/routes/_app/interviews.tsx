import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { addMonths, addWeeks, endOfWeek, format, startOfWeek, subMonths, subWeeks } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterviews } from "@/features/interviews/hooks/use-interviews";
import { CalendarMonthView } from "@/features/interviews/components/calendar-month-view";
import { CalendarWeekView } from "@/features/interviews/components/calendar-week-view";
import { CalendarAgendaView } from "@/features/interviews/components/calendar-agenda-view";
import { InterviewFormDialog } from "@/features/interviews/components/interview-form-dialog";
import type { Interview } from "@/features/interviews/types";

type View = "month" | "week" | "agenda";

export const Route = createFileRoute("/_app/interviews")({ component: InterviewsPage });

function InterviewsPage() {
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(() => new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Interview | undefined>();
  const [defaultDate, setDefaultDate] = useState<string | undefined>();

  const { data, isLoading, isError, error, refetch } = useInterviews();
  const interviews = data ?? [];

  const title = useMemo(() => {
    if (view === "month") return format(anchor, "MMMM yyyy");
    if (view === "week") {
      const start = startOfWeek(anchor, { weekStartsOn: 1 });
      const end = endOfWeek(anchor, { weekStartsOn: 1 });
      return `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`;
    }
    return "All interviews";
  }, [view, anchor]);

  const step = (dir: 1 | -1) => {
    if (view === "month") setAnchor((d) => (dir === 1 ? addMonths(d, 1) : subMonths(d, 1)));
    else if (view === "week") setAnchor((d) => (dir === 1 ? addWeeks(d, 1) : subWeeks(d, 1)));
  };

  const openNew = () => {
    setEditing(undefined);
    setDefaultDate(undefined);
    setFormOpen(true);
  };
  const openEdit = (iv: Interview) => {
    setEditing(iv);
    setDefaultDate(undefined);
    setFormOpen(true);
  };
  const openForDay = (dayKey: string) => {
    setEditing(undefined);
    setDefaultDate(dayKey);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Calendar & Interviews"
        description="Your scheduled rounds across every application."
        actions={
          <Button onClick={openNew}>
            <Plus /> Schedule interview
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {view !== "agenda" && (
            <>
              <Button variant="outline" size="icon-sm" onClick={() => step(-1)} aria-label="Previous">
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon-sm" onClick={() => step(1)} aria-label="Next">
                <ChevronRight />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAnchor(new Date())}>
                Today
              </Button>
            </>
          )}
          <span className="ml-1 text-sm font-medium">{title}</span>
        </div>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as View)}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="agenda">Agenda</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        loadingFallback={<Skeleton className="h-[32rem] w-full rounded-xl" />}
      >
        {view === "month" && (
          <CalendarMonthView
            anchor={anchor}
            interviews={interviews}
            onSelect={openEdit}
            onDayClick={openForDay}
          />
        )}
        {view === "week" && (
          <CalendarWeekView anchor={anchor} interviews={interviews} onSelect={openEdit} />
        )}
        {view === "agenda" && (
          <CalendarAgendaView interviews={interviews} onSelect={openEdit} />
        )}
      </DataState>

      {interviews.length === 0 && !isLoading && view !== "agenda" && (
        <p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <CalendarDays className="size-4" /> No interviews scheduled yet.
        </p>
      )}

      <InterviewFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        interview={editing}
        defaultDate={defaultDate}
      />
    </div>
  );
}