import { z } from "zod";

export const LocaleSchema = z.enum(["tr", "en"]);

export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  completed: z.boolean(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  order: z.number().int(),
  createdAt: z.string().min(1),
});

export const TaskListSchema = z.array(TaskSchema);

export const GrokActionSchema = z.object({
  intent: z.enum([
    "add",
    "complete",
    "uncomplete",
    "edit",
    "delete",
    "none",
  ]),
  language: LocaleSchema.optional(),
  tasks: z
    .array(
      z.object({
        title: z.string().min(1),
        dueDate: z.string().nullable().optional(),
      }),
    )
    .optional(),
  targetIndex: z.number().int().positive().optional(),
  targetTitle: z.string().optional(),
  newTitle: z.string().optional(),
  message: z.string().optional(),
});

export const InterpretInputSchema = z.object({
  text: z.string().min(1).max(2000),
  locale: LocaleSchema,
  today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tasks: z.array(
    z.object({
      index: z.number().int().positive(),
      title: z.string(),
      completed: z.boolean(),
      dueDate: z.string(),
    }),
  ),
});
