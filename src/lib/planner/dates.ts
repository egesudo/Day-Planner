import { addDays, format, parseISO } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import type { Locale } from "./types";

export function todayKey(date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDue(value: string): Date {
  return parseISO(value);
}

export function isUpcoming(dueDate: string, now = new Date()): boolean {
  return dueDate > todayKey(now);
}

export function isDueToday(dueDate: string, now = new Date()): boolean {
  return dueDate === todayKey(now);
}

export function formatLongDate(date: Date, locale: Locale): string {
  return format(date, "EEEE d MMMM", { locale: locale === "tr" ? tr : enUS });
}

export function formatShortDate(dueDate: string, locale: Locale): string {
  return format(parseISO(dueDate), "d MMM", {
    locale: locale === "tr" ? tr : enUS,
  });
}

export function resolveRelativeDue(
  raw: string | null | undefined,
  today: string,
): string {
  if (!raw) return today;
  const value = raw.trim().toLowerCase();
  if (value === "today" || value === "bugün" || value === "bugun") return today;
  if (value === "tomorrow" || value === "yarın" || value === "yarin") {
    return format(addDays(parseISO(today), 1), "yyyy-MM-dd");
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return raw.trim();
  return today;
}
