import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Outlet, useChildMatches, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  APPLICATION_STATUSES,
  PRIORITIES,
  WORK_MODES,
} from "@/constants/enums";
import { ApplicationsFilters, type FiltersValue } from "@/features/applications/components/applications-filters";
import { ApplicationsTable } from "@/features/applications/components/applications-table";
import { ApplicationsCardList } from "@/features/applications/components/applications-card-list";
import { ApplicationsGrouped } from "@/features/applications/components/applications-grouped";
import { ApplicationsPagination } from "@/features/applications/components/applications-pagination";
import { BulkActionBar } from "@/features/applications/components/bulk-action-bar";
import { ApplicationFormDialog } from "@/features/applications/components/application-form-dialog";
import {
  useApplicationsGrouped,
  useApplicationsList,
} from "@/features/applications/hooks/use-applications";
import type { SortField } from "@/features/applications/types";

const SORT_FIELDS = [
  "company",
  "role",
  "appliedDate",
  "salary",
  "status",
  "updatedAt",
  "priority",
] as const;

const searchSchema = z.object({
  q: z.string().optional(),
  status: z.array(z.enum(APPLICATION_STATUSES)).optional(),
  workMode: z.array(z.enum(WORK_MODES)).optional(),
  priority: z.array(z.enum(PRIORITIES)).optional(),
  platformId: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  location: z.string().optional(),
  companyId: z.string().optional(),
  appliedFrom: z.string().optional(),
  appliedTo: z.string().optional(),
  archived: z.enum(["true", "false", "all"]).default("false"),
  sort: z.enum(SORT_FIELDS).default("updatedAt"),
  dir: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(10).max(100).default(20),
  view: z.enum(["table", "grouped"]).default("table"),
  create: z.enum(["quick", "full"]).optional(),
});

type Search = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/_app/applications")({
  validateSearch: searchSchema,
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const hasChild = useChildMatches({ select: (m) => m.length > 0 });
  return hasChild ? <Outlet /> : <ApplicationsList />;
}

function ApplicationsList() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);

  // Open the form when arriving via the topbar "Add" action, then clear the flag.
  useEffect(() => {
    if (search.create) {
      setFormOpen(true);
      navigate({ search: (prev) => ({ ...prev, create: undefined }), replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.create]);

  const patch = (updates: Partial<FiltersValue>) =>
    navigate({ search: (prev) => ({ ...prev, ...updates }) });

  const clearFilters = () =>
    navigate({
      search: (prev) => ({
        archived: "false" as const,
        sort: prev.sort,
        dir: prev.dir,
        page: 1,
        pageSize: prev.pageSize,
        view: prev.view,
      }),
    });

  const listParams = useMemo(() => {
    const { view, create, ...rest } = search;
    void view;
    void create;
    return rest;
  }, [search]);

  const listQuery = useApplicationsList(listParams);
  const groupedQuery = useApplicationsGrouped(search.archived === "all" || search.archived === "true", search.view === "grouped");

  const applications = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;

  const onSort = (field: SortField) => {
    const sameField = search.sort === field;
    patch({ sort: field, dir: sameField && search.dir === "asc" ? "desc" : "asc" });
  };

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(applications.map((a) => a.id)) : new Set());

  const isGrouped = search.view === "grouped";

  return (
    <div className="space-y-4">
      <PageHeader
        title="Applications"
        description="Search, filter, and manage every application."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus /> Add application
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setFormOpen(true)}>Add application</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <ApplicationsFilters value={search} onChange={patch} onClear={clearFilters} />

      {selected.size > 0 && (
        <BulkActionBar ids={[...selected]} onClear={() => setSelected(new Set())} />
      )}

      {isGrouped ? (
        <DataState
          isLoading={groupedQuery.isLoading}
          isError={groupedQuery.isError}
          error={groupedQuery.error}
          onRetry={groupedQuery.refetch}
          isEmpty={(groupedQuery.data ?? []).length === 0}
          emptyTitle="No applications"
          emptyDescription="Add your first application to see it grouped by company."
        >
          {groupedQuery.data && <ApplicationsGrouped groups={groupedQuery.data} />}
        </DataState>
      ) : (
        <DataState
          isLoading={listQuery.isLoading}
          isError={listQuery.isError}
          error={listQuery.error}
          onRetry={listQuery.refetch}
          isEmpty={applications.length === 0}
          emptyTitle={search.q || hasAnyFilter(search) ? "No matches" : "No applications yet"}
          emptyDescription={
            search.q || hasAnyFilter(search)
              ? "Try adjusting your search or filters."
              : "Add your first application to get started."
          }
          emptyAction={
            (search.q || hasAnyFilter(search)) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )
          }
          loadingFallback={<Skeleton className="h-96 w-full rounded-xl" />}
        >
          <div className="space-y-4">
            <div className="hidden md:block">
              <ApplicationsTable
                applications={applications}
                sort={search.sort}
                dir={search.dir}
                onSort={onSort}
                selected={selected}
                onToggle={toggle}
                onToggleAll={toggleAll}
              />
            </div>
            <div className="md:hidden">
              <ApplicationsCardList
                applications={applications}
                selected={selected}
                onToggle={toggle}
              />
            </div>
            {meta && (
              <ApplicationsPagination
                meta={meta}
                onPageChange={(page) => patch({ page })}
                onPageSizeChange={(pageSize) => patch({ pageSize, page: 1 })}
              />
            )}
          </div>
        </DataState>
      )}

      <ApplicationFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

function hasAnyFilter(s: Search): boolean {
  return Boolean(
    s.status?.length ||
    s.workMode?.length ||
    s.priority?.length ||
    s.platformId?.length ||
    s.techStack?.length ||
    s.location ||
    s.appliedFrom ||
    s.appliedTo ||
    s.archived !== "false",
  );
}