/** User timezone — used for server-side date grouping (Vercel runs in UTC) */
const USER_TZ = "Asia/Jerusalem";

/** Convert ISO/Date to YYYY-MM-DD in user's local timezone (works on both client and server) */
export function toLocalDateStr(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  // en-CA locale gives YYYY-MM-DD format natively
  return d.toLocaleDateString("en-CA", { timeZone: USER_TZ });
}

/** Format relative date like "2 hours ago", "Yesterday", etc. */
export function relativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

/** Get month name + year */
export function monthLabel(year: number, month: number): string {
  return new Date(year, month).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
}

/** Get days in month */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Get day of week for first day of month (0 = Sunday) */
export function firstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Format duration between two ISO dates */
export function formatDuration(start: string, end: string | null): string {
  if (!end) return "Ongoing";
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(diffMs / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
