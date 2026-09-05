export type Locale = "tr" | "en";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  order: number;
  createdAt: string;
};

export type PlannerIntent =
  | "add"
  | "complete"
  | "uncomplete"
  | "edit"
  | "delete"
  | "none";

export type GrokAction = {
  intent: PlannerIntent;
  language?: Locale;
  tasks?: { title: string; dueDate?: string | null }[];
  targetIndex?: number;
  targetTitle?: string;
  newTitle?: string;
  message?: string;
};

export type ViewFilter = "today" | "upcoming";
