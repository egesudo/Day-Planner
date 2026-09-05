import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyAction } from "./apply-action";
import { isDueToday, isUpcoming, todayKey } from "./dates";
import { interpretSpeech } from "./interpret-speech";
import { interpretLocally } from "./local-intent";
import { loadLocale, loadTasks, saveLocale, saveTasks } from "./storage";
import type { Locale, Task, ViewFilter } from "./types";

type PlannerContextValue = {
  hydrated: boolean;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  tasks: Task[];
  filter: ViewFilter;
  setFilter: (filter: ViewFilter) => void;
  visible: Task[];
  todayTasks: Task[];
  completedToday: number;
  addManual: (title: string, dueDate?: string) => void;
  toggle: (id: string) => void;
  updateTitle: (id: string, title: string) => void;
  remove: (id: string) => void;
  processUtterance: (text: string) => Promise<string | null>;
  processing: boolean;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("tr");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<ViewFilter>("today");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setLocaleState(loadLocale());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveTasks(tasks);
  }, [tasks, hydrated]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    saveLocale(next);
  }, []);

  const todayTasks = useMemo(
    () =>
      tasks
        .filter((task) => isDueToday(task.dueDate))
        .sort((a, b) => a.order - b.order),
    [tasks],
  );

  const visible = useMemo(() => {
    const list =
      filter === "today"
        ? todayTasks
        : tasks
            .filter((task) => isUpcoming(task.dueDate))
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.order - b.order);
    return list;
  }, [filter, tasks, todayTasks]);

  const completedToday = todayTasks.filter((task) => task.completed).length;

  const addManual = useCallback((title: string, dueDate?: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      applyAction(prev, {
        intent: "add",
        tasks: [{ title: trimmed, dueDate: dueDate ?? "today" }],
      }),
    );
  }, []);

  const toggle = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const updateTitle = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: trimmed } : task)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const processUtterance = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return null;
      setProcessing(true);
      const snapshot = tasks;
      const today = todayKey();
      const payload = {
        text: trimmed,
        locale,
        today,
        tasks: todayTasks.map((task, index) => ({
          index: index + 1,
          title: task.title,
          completed: task.completed,
          dueDate: task.dueDate,
        })),
      };
      try {
        const result = await interpretSpeech({ data: payload });
        if (result.ok) {
          setTasks((prev) => applyAction(prev, result.action, today));
          return result.action.message ?? null;
        }
      } catch {
        /* fall through to local rules */
      } finally {
        setProcessing(false);
      }
      const local = interpretLocally(trimmed, locale, snapshot);
      setTasks((prev) => applyAction(prev, local, today));
      return local.message ?? null;
    },
    [locale, tasks, todayTasks],
  );

  const value = useMemo(
    () => ({
      hydrated,
      locale,
      setLocale,
      tasks,
      filter,
      setFilter,
      visible,
      todayTasks,
      completedToday,
      addManual,
      toggle,
      updateTitle,
      remove,
      processUtterance,
      processing,
    }),
    [
      hydrated,
      locale,
      setLocale,
      tasks,
      filter,
      visible,
      todayTasks,
      completedToday,
      addManual,
      toggle,
      updateTitle,
      remove,
      processUtterance,
      processing,
    ],
  );

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
