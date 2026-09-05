import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schema-zPuaXbln.js
var LocaleSchema = _enum(["tr", "en"]);
var TaskSchema = object({
	id: string().min(1),
	title: string().min(1),
	completed: boolean(),
	dueDate: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	order: number().int(),
	createdAt: string().min(1)
});
var TaskListSchema = array(TaskSchema);
var GrokActionSchema = object({
	intent: _enum([
		"add",
		"complete",
		"uncomplete",
		"edit",
		"delete",
		"none"
	]),
	language: LocaleSchema.optional(),
	tasks: array(object({
		title: string().min(1),
		dueDate: string().nullable().optional()
	})).optional(),
	targetIndex: number().int().positive().optional(),
	targetTitle: string().optional(),
	newTitle: string().optional(),
	message: string().optional()
});
var InterpretInputSchema = object({
	text: string().min(1).max(2e3),
	locale: LocaleSchema,
	today: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	tasks: array(object({
		index: number().int().positive(),
		title: string(),
		completed: boolean(),
		dueDate: string()
	}))
});
//#endregion
export { InterpretInputSchema as n, TaskListSchema as r, GrokActionSchema as t };
