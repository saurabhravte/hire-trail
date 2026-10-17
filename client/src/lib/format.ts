import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(value?: string | Date | null, pattern = "d MMM yyyy"): string {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return Number.isNaN(date.getTime()) ? "—" : format(date, pattern);
}

export function formatDateTime(value?: string | Date | null): string {
  return formatDate(value, "d MMM yyyy, h:mm a");
}

export function formatRelative(value?: string | Date | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return Number.isNaN(date.getTime()) ? "—" : formatDistanceToNow(date, { addSuffix: true });
}

/** Salary with currency + period; never fabricates a value. */
export function formatMoney(
  amount?: number | null,
  currency?: string | null,
  period?: string | null,
): string {
  if (amount == null) return "—";
  let formatted: string;
  try {
    formatted = new Intl.NumberFormat(undefined, {
      style: currency ? "currency" : "decimal",
      currency: currency || undefined,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    formatted = `${currency ? `${currency} ` : ""}${amount.toLocaleString()}`;
  }
  const periodLabel = period ? `/${period.replace("ly", "")}` : "";
  return `${formatted}${periodLabel}`;
}

export function formatPercent(ratio?: number | null): string {
  if (ratio == null) return "—";
  return `${Math.round(ratio * 1000) / 10}%`;
}

/** "offer_received" -> "Offer Received" */
export function humanize(value?: string | null): string {
  if (!value) return "—";
  return value
    .split(/[_\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}