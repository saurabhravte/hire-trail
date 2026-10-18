import { useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useApplicationInterviews } from "../hooks/use-interviews";
import { InterviewCard } from "./interview-card";
import { InterviewFormDialog } from "./interview-form-dialog";
import type { Interview } from "../types";

export function ApplicationInterviewsSection({ applicationId }: { applicationId: string }) {
  const { data, isLoading, isError, error, refetch } = useApplicationInterviews(applicationId);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Interview | undefined>();

  const openNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };
  const openEdit = (iv: Interview) => {
    setEditing(iv);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Interviews</CardTitle>
        <Button size="xs" variant="outline" onClick={openNew}>
          <Plus /> Schedule
        </Button>
      </CardHeader>
      <CardContent>
        <DataState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          isEmpty={(data ?? []).length === 0}
          emptyTitle=""
        >
          {data && data.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {data.map((iv) => (
                <InterviewCard key={iv.id} interview={iv} onEdit={openEdit} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarClock />}
              title="No interviews yet"
              description="Schedule rounds for this application."
            />
          )}
        </DataState>
      </CardContent>

      <InterviewFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        applicationId={applicationId}
        interview={editing}
      />
    </Card>
  );
}