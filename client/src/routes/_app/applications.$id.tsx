import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  ExternalLink,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataState } from "@/components/shared/data-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatMoney, humanize } from "@/lib/format";
import {
  useApplication,
  useApplicationActivity,
  useApplicationHistory,
} from "@/features/applications/hooks/use-applications";
import {
  useArchiveApplication,
  useDeleteApplication,
} from "@/features/applications/hooks/use-application-mutations";
import { ApplicationFormDialog } from "@/features/applications/components/application-form-dialog";
import { StatusChangeDialog } from "@/features/applications/components/status-change-dialog";
import { StatusHistoryTimeline } from "@/features/applications/components/status-history-timeline";
import { ActivityTimeline } from "@/features/applications/components/activity-timeline";

export const Route = createFileRoute("/_app/applications/$id")({ component: ApplicationDetailPage });

function ApplicationDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const appQuery = useApplication(id);
  const historyQuery = useApplicationHistory(id);
  const activityQuery = useApplicationActivity(id);
  const archive = useArchiveApplication();
  const remove = useDeleteApplication();

  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const app = appQuery.data;

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to="/applications">
          <ArrowLeft /> Back to applications
        </Link>
      </Button>

      <DataState
        isLoading={appQuery.isLoading}
        isError={appQuery.isError}
        error={appQuery.error}
        onRetry={appQuery.refetch}
      >
        {app && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-xl font-semibold tracking-tight">{app.role}</h1>
                  <StatusBadge status={app.status} />
                  {app.isArchived && <Badge variant="secondary">Archived</Badge>}
                  {app.priority !== "normal" && <Badge variant="outline">{humanize(app.priority)}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{app.companyName ?? "—"}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setStatusOpen(true)}>
                  <RefreshCw /> Change status
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  <Pencil /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => archive.mutate({ id: app.id, archived: !app.isArchived })}
                >
                  {app.isArchived ? <ArchiveRestore /> : <Archive />}
                  {app.isArchived ? "Restore" : "Archive"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                  <Trash2 /> Delete
                </Button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                    <Detail label="Salary" value={formatMoney(app.salaryMax ?? app.salaryMin, app.currency, app.payPeriod)} />
                    <Detail label="Location" value={app.location} />
                    <Detail label="Work mode" value={app.workMode ? humanize(app.workMode) : null} />
                    <Detail label="Applied" value={formatDate(app.appliedDate)} />
                    <Detail label="Job ID" value={app.jobId} />
                    <Detail label="Created" value={formatDate(app.createdAt)} />
                    <div className="col-span-2 sm:col-span-3">
                      <DetailLabel>Tech stack</DetailLabel>
                      {app.techStack.length ? (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {app.techStack.map((t) => (
                            <Badge key={t} variant="secondary">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">—</p>
                      )}
                    </div>
                    {app.jobUrl && (
                      <div className="col-span-2 sm:col-span-3">
                        <DetailLabel>Job posting</DetailLabel>
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-0.5 flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                        >
                          Open posting <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {(app.recruiterName || app.recruiterEmail || app.referralPerson) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Contacts & referral</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                      <Detail label="Recruiter" value={app.recruiterName} />
                      <Detail label="Recruiter email" value={app.recruiterEmail} />
                      <Detail label="Recruiter phone" value={app.recruiterPhone} />
                      <Detail label="Referral" value={app.referralPerson} />
                      {app.referralNotes && (
                        <div className="col-span-2 sm:col-span-3">
                          <DetailLabel>Referral notes</DetailLabel>
                          <p className="mt-0.5 text-sm">{app.referralNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {app.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{app.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="lg:sticky lg:top-20 lg:self-start">
                <CardHeader>
                  <CardTitle className="text-sm">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="status">
                    <TabsList variant="line">
                      <TabsTrigger value="status">Status history</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <Separator className="my-3" />
                    <TabsContent value="status">
                      <DataState
                        isLoading={historyQuery.isLoading}
                        isError={historyQuery.isError}
                        onRetry={historyQuery.refetch}
                      >
                        {historyQuery.data && <StatusHistoryTimeline entries={historyQuery.data} />}
                      </DataState>
                    </TabsContent>
                    <TabsContent value="activity">
                      <DataState
                        isLoading={activityQuery.isLoading}
                        isError={activityQuery.isError}
                        onRetry={activityQuery.refetch}
                      >
                        {activityQuery.data && <ActivityTimeline entries={activityQuery.data} />}
                      </DataState>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <ApplicationFormDialog open={editOpen} onOpenChange={setEditOpen} application={app} />
            <StatusChangeDialog
              open={statusOpen}
              onOpenChange={setStatusOpen}
              applicationId={app.id}
              currentStatus={app.status}
            />
            <ConfirmDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              title="Delete this application?"
              description="This permanently removes the application and its history."
              confirmLabel="Delete"
              destructive
              onConfirm={() =>
                remove.mutate(app.id, { onSuccess: () => navigate({ to: "/applications" }) })
              }
            />
          </>
        )}
      </DataState>
    </div>
  );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-muted-foreground">{children}</p>;
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <DetailLabel>{label}</DetailLabel>
      <p className="mt-0.5 text-sm">{value || "—"}</p>
    </div>
  );
}