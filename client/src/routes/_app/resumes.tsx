import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumes } from "@/features/resumes/hooks/use-resumes";
import { ResumeCard } from "@/features/resumes/components/resume-card";
import { ResumeFormDialog } from "@/features/resumes/components/resume-form-dialog";

export const Route = createFileRoute("/_app/resumes")({ component: ResumesPage });

function ResumesPage() {
  const { data, isLoading, isError, error, refetch } = useResumes();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Resumes & Documents"
        description="Manage resume versions and link the right one to each application."
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus /> Add resume
          </Button>
        }
      />

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={(data ?? []).length === 0}
        emptyTitle="No resumes yet"
        emptyDescription="Add a resume version to track which one you used where."
        emptyAction={
          <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
            <FileText /> Add resume
          </Button>
        }
        loadingFallback={
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {data?.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      </DataState>

      <ResumeFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}