export function formatLongDate(value: string | Date = new Date()): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const text = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function initials(name: string | null | undefined, email?: string): string {
  const source = name?.trim() || email?.split("@")[0] || "ON";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function formatDayMonth(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "À préciser";
  if (start && end) return `${formatDayMonth(start)} – ${formatDayMonth(end)}`;
  return formatDayMonth(start || end);
}

export function roleLabel(role: string): string {
  if (role === "ADMIN") return "Administrateur";
  if (role === "STAFF") return "Équipe";
  return role;
}

export function parseAmount(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/\s/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function formatFcfa(value: string | number | null | undefined): string {
  const n = parseAmount(value);
  if (n === null) return "À renseigner";
  return `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`;
}
