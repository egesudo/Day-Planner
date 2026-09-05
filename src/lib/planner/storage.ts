import { TaskListSchema } from "./schema";
import type { Locale, Task } from "./types";

const TASKS_KEY = "gun-plani.tasks.v1";
const LOCALE_KEY = "gun-plani.locale.v1";

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    return TaskListSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadLocale(): Locale {
  if (typeof window === "undefined") return "tr";
  const stored = window.localStorage.getItem(LOCALE_KEY);
  if (stored === "en" || stored === "tr") return stored;
  return navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
}

export function saveLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_KEY, locale);
}
