import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CsvExportButton } from "@/features/data-io/components/csv-export-button";
import { CsvImportDialog } from "@/features/data-io/components/csv-import-dialog";
import { useExportData } from "../hooks/use-profile";

export function DataSettings() {
  const exportData = useExportData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Applications CSV</p>
            <p className="text-xs text-muted-foreground">Export or import your applications.</p>
          </div>
          <div className="flex items-center gap-2">
            <CsvExportButton />
            <CsvImportDialog />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Personal data export</p>
            <p className="text-xs text-muted-foreground">
              Download everything we store about your account as JSON.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => exportData.mutate()}
            disabled={exportData.isPending}
          >
            {exportData.isPending ? <Spinner className="size-4" /> : <Download />}
            Export my data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}