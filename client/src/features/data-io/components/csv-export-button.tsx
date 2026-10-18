import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useExportCsv } from "../hooks/use-data-io";

export function CsvExportButton() {
  const exportCsv = useExportCsv();
  return (
    <Button variant="outline" onClick={() => exportCsv.mutate()} disabled={exportCsv.isPending}>
      {exportCsv.isPending ? <Spinner className="size-4" /> : <Download />}
      Export CSV
    </Button>
  );
}