import { useState } from "react";
import { Download, FileText, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatDate } from "@/lib/format";
import { resumesService } from "../services/resumes.service";
import { useDeleteResume, useSetDefaultResume } from "../hooks/use-resume-mutations";
import { ResumeFormDialog } from "./resume-form-dialog";
import type { ResumeVersion } from "../types";

function formatBytes(bytes?: number | null): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function ResumeCard({ resume }: { resume: ResumeVersion }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const setDefault = useSetDefaultResume();
  const remove = useDeleteResume();

  const download = async () => {
    try {
      setDownloading(true);
      const { url } = await resumesService.signedUrl(resume.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t get download link");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card size="sm">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-medium">{resume.label}</p>
                {resume.isDefault && (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400">
                    Default
                  </Badge>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {resume.fileName
                  ? `${resume.fileName}${resume.fileSize ? ` · ${formatBytes(resume.fileSize)}` : ""}`
                  : "No file uploaded"}
              </p>
              <p className="text-xs text-muted-foreground">Updated {formatDate(resume.updatedAt)}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Resume actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {resume.filePath && (
                <DropdownMenuItem onSelect={download} disabled={downloading}>
                  <Download /> Download
                </DropdownMenuItem>
              )}
              {!resume.isDefault && (
                <DropdownMenuItem onSelect={() => setDefault.mutate(resume.id)}>
                  <Star /> Make default
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {resume.notes && <p className="text-sm text-muted-foreground">{resume.notes}</p>}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {resume.filePath && (
            <button
              type="button"
              onClick={download}
              disabled={downloading}
              className="flex items-center gap-1 text-primary underline-offset-4 hover:underline disabled:opacity-50"
            >
              <Download className="size-3" /> {downloading ? "Opening…" : "Download"}
            </button>
          )}
          {resume.coverLetterUrl && (
            <a href={resume.coverLetterUrl} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              Cover letter
            </a>
          )}
          {resume.portfolioUrl && (
            <a href={resume.portfolioUrl} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </CardContent>

      <ResumeFormDialog open={editOpen} onOpenChange={setEditOpen} resume={resume} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this resume?"
        description="This removes the version and its stored file. Applications keep their other details."
        confirmLabel="Delete"
        destructive
        onConfirm={() => remove.mutate(resume.id)}
      />
    </Card>
  );
}