import { Clock, MapPin, Trash2, User, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useState } from "react";
import { ROUND_LABELS } from "@/constants/interview";
import { formatWhen } from "@/lib/datetime";
import { useDeleteInterview } from "../hooks/use-interview-mutations";
import type { Interview } from "../types";
import { InterviewStatusBadge } from "./interview-status-badge";

interface Props {
  interview: Interview;
  onEdit: (interview: Interview) => void;
}

export function InterviewCard({ interview, onEdit }: Props) {
  const [confirm, setConfirm] = useState(false);
  const remove = useDeleteInterview();

  return (
    <Card size="sm">
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{ROUND_LABELS[interview.roundType]} round</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {formatWhen(interview.startTime, interview.timezone)}
            </p>
          </div>
          <InterviewStatusBadge status={interview.status} />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {interview.interviewer && (
            <span className="flex items-center gap-1">
              <User className="size-3" /> {interview.interviewer}
            </span>
          )}
          {interview.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" /> {interview.location}
            </span>
          )}
          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            >
              <Video className="size-3" /> Join
            </a>
          )}
        </div>

        <div className="flex items-center justify-end gap-1 pt-1">
          <Button variant="ghost" size="xs" onClick={() => onEdit(interview)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Delete interview"
            onClick={() => setConfirm(true)}
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete this interview?"
        description="This removes the interview and its reminder."
        confirmLabel="Delete"
        destructive
        onConfirm={() =>
          remove.mutate({ id: interview.id, applicationId: interview.applicationId })
        }
      />
    </Card>
  );
}