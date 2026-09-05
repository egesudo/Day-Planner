import type { GrokAction, Task } from "./types";
import { resolveRelativeDue, todayKey } from "./dates";

function newId(): string {
  return crypto.randomUUID();
}

function nextOrder(tasks: Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.order), 0) + 1;
}

function visibleToday(tasks: Task[], today: string): Task[] {
  return [...tasks]
    .filter((task) => task.dueDate === today)
    .sort((a, b) => a.order - b.order);
}

function findTarget(
  tasks: Task[],
  action: GrokAction,
  numbered: Task[],
): Task | undefined {
  if (action.targetIndex) {
    return numbered[action.targetIndex - 1];
  }
  if (action.targetTitle) {
    const q = action.targetTitle.toLowerCase();
    return (
      numbered.find((task) => task.title.toLowerCase().includes(q)) ??
      tasks.find((task) => task.title.toLowerCase().includes(q))
    );
  }
  return numbered.find((task) => !task.completed);
}

export function applyAction(
  tasks: Task[],
  action: GrokAction,
  today = todayKey(),
  numbered?: Task[],
): Task[] {
  if (action.intent === "add" && action.tasks?.length) {
    let order = nextOrder(tasks);
    const added: Task[] = action.tasks
      .map((item) => item.title.trim())
      .filter(Boolean)
      .map((title, i) => ({
        id: newId(),
        title,
        completed: false,
        dueDate: resolveRelativeDue(action.tasks![i]?.dueDate, today),
        order: order++,
        createdAt: new Date().toISOString(),
      }));
    return added.length ? [...tasks, ...added] : tasks;
  }

  if (action.intent === "none") return tasks;

  const list = numbered ?? visibleToday(tasks, today);
  const target = findTarget(tasks, action, list);
  if (!target) return tasks;

  if (action.intent === "complete") {
    return tasks.map((task) =>
      task.id === target.id ? { ...task, completed: true } : task,
    );
  }
  if (action.intent === "uncomplete") {
    return tasks.map((task) =>
      task.id === target.id ? { ...task, completed: false } : task,
    );
  }
  if (action.intent === "delete") {
    return tasks.filter((task) => task.id !== target.id);
  }
  if (action.intent === "edit" && action.newTitle?.trim()) {
    return tasks.map((task) =>
      task.id === target.id ? { ...task, title: action.newTitle!.trim() } : task,
    );
  }
  return tasks;
}

export function firstNewlyCompleted(before: Task[], after: Task[]): Task | null {
  const prev = new Map(before.map((task) => [task.id, task]));
  for (const task of after) {
    const old = prev.get(task.id);
    if (task.completed && old && !old.completed) return task;
  }
  return null;
}
