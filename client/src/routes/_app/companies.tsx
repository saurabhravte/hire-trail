import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, Search, X } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useCompanies } from "@/features/companies/hooks/use-companies";
import { CompanyAccordionItem } from "@/features/companies/components/company-accordion-item";
import { CompanyFormDialog } from "@/features/companies/components/company-form-dialog";
import { ApplicationsPagination } from "@/features/applications/components/applications-pagination";

export const Route = createFileRoute("/_app/companies")({ component: CompaniesPage });

function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 350);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  const { data, isLoading, isError, error, refetch } = useCompanies({
    q: debouncedSearch || undefined,
    page,
    pageSize,
  });

  const companies = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Companies & Contacts"
        description="Keep company details and recruiter contacts in one place."
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus /> Add company
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies…"
          className="px-8"
          aria-label="Search companies"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={companies.length === 0}
        emptyTitle={debouncedSearch ? "No matches" : "No companies yet"}
        emptyDescription={
          debouncedSearch
            ? "Try a different search."
            : "Companies are created automatically when you add applications, or add one here."
        }
        emptyAction={
          !debouncedSearch && (
            <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
              <Building2 /> Add company
            </Button>
          )
        }
        loadingFallback={
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        }
      >
        <div className="space-y-4">
          <Accordion type="multiple" className="rounded-xl border px-3">
            {companies.map((company) => (
              <CompanyAccordionItem key={company.id} company={company} />
            ))}
          </Accordion>
          {meta && meta.totalPages > 1 && (
            <ApplicationsPagination
              meta={meta}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )}
        </div>
      </DataState>

      <CompanyFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}