import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Upload } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveBlob } from "@/lib/api-client";
import { useCommitImport, usePreviewImport } from "../hooks/use-data-io";
import type { ImportPreview } from "../types";

const TEMPLATE_HEADER =
  "company,role,status,appliedDate,salaryMin,salaryMax,currency,payPeriod,location,workMode,techStack,platform,priority,jobUrl,jobId,notes";

export function CsvImportDialog() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewMut = usePreviewImport();
  const commitMut = useCommitImport();

  const reset = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    previewMut.mutate(file, { onSuccess: setPreview });
  };

  const commit = () => {
    if (!preview) return;
    commitMut.mutate(preview.importJobId, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const downloadErrors = () => {
    if (!preview) return;
    const lines = preview.errors.map((e) => `Row ${e.row}: ${e.messages.join("; ")}`);
    saveBlob(new Blob([lines.join("\n")], { type: "text/plain" }), "import-errors.txt");
  };

  const downloadTemplate = () =>
    saveBlob(new Blob([`${TEMPLATE_HEADER}\n`], { type: "text/csv" }), "import-template.csv");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload /> Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import applications</DialogTitle>
          <DialogDescription>
            Upload a CSV to preview and validate before anything is saved.
          </DialogDescription>
        </DialogHeader>

        {!preview ? (
          <div className="space-y-4">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={onFile}
              className="hidden"
            />
            <Button
              variant="outline"
              className="h-24 w-full border-dashed"
              onClick={() => fileRef.current?.click()}
              disabled={previewMut.isPending}
            >
              {previewMut.isPending ? (
                <Spinner className="size-5" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="size-5" />
                  Choose a CSV file
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={downloadTemplate}>
              <Download /> Download template
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Total" value={preview.totalRows} />
              <Stat label="Valid" value={preview.validRows} tone="ok" />
              <Stat label="Errors" value={preview.errorRows} tone={preview.errorRows ? "bad" : undefined} />
            </div>

            {preview.validRows > 0 && (
              <Alert>
                <CheckCircle2 />
                <AlertTitle>{preview.validRows} rows ready to import</AlertTitle>
                <AlertDescription>
                  {preview.errorRows > 0
                    ? "Invalid rows will be skipped."
                    : "All rows passed validation."}
                </AlertDescription>
              </Alert>
            )}

            {preview.duplicates.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle />
                <AlertTitle>{preview.duplicates.length} possible duplicates</AlertTitle>
                <AlertDescription>
                  Some rows match existing applications. They’ll still import if you continue.
                </AlertDescription>
              </Alert>
            )}

            {preview.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Row errors</p>
                  <Button variant="ghost" size="xs" onClick={downloadErrors}>
                    <Download /> Error report
                  </Button>
                </div>
                <ScrollArea className="max-h-40 rounded-lg border">
                  <ul className="divide-y text-xs">
                    {preview.errors.map((err) => (
                      <li key={err.row} className="px-2.5 py-1.5">
                        <span className="font-medium">Row {err.row}:</span> {err.messages.join("; ")}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {preview ? (
            <>
              <Button variant="outline" onClick={reset}>
                Choose another file
              </Button>
              <Button
                onClick={commit}
                disabled={preview.validRows === 0 || commitMut.isPending}
              >
                {commitMut.isPending && <Spinner className="size-4" />}
                Import {preview.validRows} rows
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "ok" | "bad" }) {
  const color =
    tone === "ok"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "bad"
        ? "text-rose-600 dark:text-rose-400"
        : "";
  return (
    <div className="rounded-lg border p-2">
      <p className={`font-heading text-xl font-semibold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

