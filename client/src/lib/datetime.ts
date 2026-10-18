import { format, parseISO } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const FALLBACK_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function listTimezones(): string[] {
  const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
  if (typeof intl.supportedValuesOf === "function") {
    try {
      return intl.supportedValuesOf("timeZone");
    } catch {
      /* fall through */
    }
  }
  return FALLBACK_TIMEZONES;
}

/** datetime-local wall-clock string in `tz` → UTC ISO string. */
export function zonedInputToUtcIso(localDateTime: string, tz: string): string {
  return fromZonedTime(localDateTime, tz).toISOString();
}

/** UTC ISO → datetime-local string representing the wall-clock in `tz`. */
export function utcIsoToZonedInput(iso: string, tz: string): string {
  return format(toZonedTime(parseISO(iso), tz), "yyyy-MM-dd'T'HH:mm");
}

/** yyyy-MM-dd day key for the wall-clock date in `tz` (for calendar grouping). */
export function zonedDayKey(iso: string, tz: string): string {
  return format(toZonedTime(parseISO(iso), tz), "yyyy-MM-dd");
}

/** "10:00 AM" in `tz`. */
export function zonedTime(iso: string, tz: string): string {
  return format(toZonedTime(parseISO(iso), tz), "h:mm a");
}

/** "Sat 1 Nov, 10:00 AM (Asia/Kolkata)". */
export function formatWhen(iso: string, tz: string): string {
  const zoned = toZonedTime(parseISO(iso), tz);
  return `${format(zoned, "EEE d MMM, h:mm a")} (${tz})`;
}

export function addMinutesIso(iso: string, minutes: number): string {
  return new Date(parseISO(iso).getTime() + minutes * 60_000).toISOString();
}

export function durationMinutes(startIso: string, endIso?: string | null): number {
  if (!endIso) return 60;
  const diff = (parseISO(endIso).getTime() - parseISO(startIso).getTime()) / 60_000;
  return diff > 0 ? Math.round(diff) : 60;
}