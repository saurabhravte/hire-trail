import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Show the leading "live" signal dot next to the title. */
  live?: boolean;
}

export function PageHeader({
  title,
  description,
  actions,
  live = true,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {live && <span className="size-1.5 rounded-full bg-primary" />}
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
        {description && (
          <p className="font-mono text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
