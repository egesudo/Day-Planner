import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as InterpretInputSchema, r as TaskListSchema } from "./schema-zPuaXbln.mjs";
import { a as Plus, c as Check, i as Square, o as Pencil, r as Trash2, s as Mic, t as X } from "../_libs/lucide-react.mjs";
import { a as format, c as addDays, i as isAfter, n as parseISO, o as enUS, r as isToday, s as startOfDay, t as tr } from "../_libs/date-fns.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DQMuw57-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function todayKey(date = /* @__PURE__ */ new Date()) {
	return format(date, "yyyy-MM-dd");
}
function parseDue(value) {
	return startOfDay(parseISO(value));
}
function isUpcoming(dueDate, now = /* @__PURE__ */ new Date()) {
	const due = parseDue(dueDate);
	return isAfter(due, startOfDay(now)) && !isToday(due);
}
function isDueToday(dueDate) {
	return isToday(parseDue(dueDate));
}
function formatLongDate(date, locale) {
	return format(date, "EEEE d MMMM", { locale: locale === "tr" ? tr : enUS });
}
function formatShortDate(dueDate, locale) {
	return format(parseDue(dueDate), "d MMM", { locale: locale === "tr" ? tr : enUS });
}
function resolveRelativeDue(raw, today) {
	if (!raw) return today;
	const value = raw.trim().toLowerCase();
	if (value === "today" || value === "bugün" || value === "bugun") return today;
	if (value === "tomorrow" || value === "yarın" || value === "yarin") return format(addDays(parseISO(today), 1), "yyyy-MM-dd");
	if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return raw.trim();
	return today;
}
function newId() {
	return crypto.randomUUID();
}
function nextOrder(tasks) {
	return tasks.reduce((max, task) => Math.max(max, task.order), 0) + 1;
}
function visibleToday(tasks, today) {
	return [...tasks].filter((task) => task.dueDate === today).sort((a, b) => a.order - b.order);
}
function findTarget(tasks, action, today) {
	const todayTasks = visibleToday(tasks, today);
	if (action.targetIndex) return todayTasks[action.targetIndex - 1] ?? tasks[action.targetIndex - 1];
	if (action.targetTitle) {
		const q = action.targetTitle.toLowerCase();
		return todayTasks.find((task) => task.title.toLowerCase().includes(q)) ?? tasks.find((task) => task.title.toLowerCase().includes(q));
	}
}
function applyAction(tasks, action, today = todayKey()) {
	if (action.intent === "add" && action.tasks?.length) {
		let order = nextOrder(tasks);
		const added = action.tasks.map((item) => ({
			id: newId(),
			title: item.title.trim(),
			completed: false,
			dueDate: resolveRelativeDue(item.dueDate, today),
			order: order++,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}));
		return [...tasks, ...added];
	}
	const target = findTarget(tasks, action, today);
	if (!target) return tasks;
	if (action.intent === "complete") return tasks.map((task) => task.id === target.id ? {
		...task,
		completed: true
	} : task);
	if (action.intent === "uncomplete") return tasks.map((task) => task.id === target.id ? {
		...task,
		completed: false
	} : task);
	if (action.intent === "delete") return tasks.filter((task) => task.id !== target.id);
	if (action.intent === "edit" && action.newTitle) return tasks.map((task) => task.id === target.id ? {
		...task,
		title: action.newTitle.trim()
	} : task);
	return tasks;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var interpretSpeech = createServerFn({ method: "POST" }).validator((input) => InterpretInputSchema.parse(input)).handler(createSsrRpc("f4d658f73b65785a6eff8561baaa81eb1a60566527f0d3cac653e7b09869002d"));
var ORDINAL_MAP = {
	birinci: 1,
	ikinci: 2,
	üçüncü: 3,
	ucuncu: 3,
	dördüncü: 4,
	dorduncu: 4,
	beşinci: 5,
	besinci: 5,
	altıncı: 6,
	altinci: 6,
	yedinci: 7,
	sekizinci: 8,
	dokuzuncu: 9,
	onuncu: 10,
	first: 1,
	second: 2,
	third: 3,
	fourth: 4,
	fifth: 5,
	sixth: 6,
	seventh: 7,
	eighth: 8,
	ninth: 9,
	tenth: 10
};
function findIndex(text) {
	const numbered = text.match(/\b(\d+)\.?\s*(görev|plan|task|planlama)?/i);
	if (numbered) {
		const n = Number(numbered[1]);
		if (n > 0) return n;
	}
	const lower = text.toLowerCase();
	for (const [word, index] of Object.entries(ORDINAL_MAP)) if (lower.includes(word)) return index;
}
function splitItems(text) {
	return text.split(/[,;\n]| ve | and | sonra | then /i).map((part) => part.replace(/^(bugün|yarın|today|tomorrow|please|lütfen)\s+/i, "").trim()).filter((part) => part.length > 1);
}
function interpretLocally(text, _locale, _tasks) {
	const raw = text.trim();
	const lower = raw.toLowerCase();
	const complete = /bitirdim|tamamladım|tamamladim|yaptım|yaptim|bitti|finished|completed|done|mark .* complete/.test(lower);
	const uncomplete = /geri al|tamamlanmadı|tamamlanmadi|uncomplete|not done|reopen/.test(lower);
	const del = /sil|kaldır|kaldir|delete|remove/.test(lower);
	const edit = /düzenle|duzenle|değiştir|degistir|rename|edit|change/.test(lower);
	const targetIndex = findIndex(raw);
	if (complete && !uncomplete) return {
		intent: "complete",
		targetIndex,
		message: raw
	};
	if (uncomplete) return {
		intent: "uncomplete",
		targetIndex,
		message: raw
	};
	if (del) return {
		intent: "delete",
		targetIndex,
		message: raw
	};
	if (edit) return {
		intent: "edit",
		targetIndex,
		newTitle: raw,
		message: raw
	};
	const titles = splitItems(raw).filter((item) => !/^(bugün|yarın|today|tomorrow)$/i.test(item));
	if (titles.length === 0) return {
		intent: "none",
		message: raw
	};
	const dueDate = /yarın|yarin|tomorrow/.test(lower) ? "tomorrow" : /bugün|bugun|today/.test(lower) ? "today" : null;
	return {
		intent: "add",
		tasks: titles.map((title) => ({
			title,
			dueDate
		})),
		message: raw
	};
}
var TASKS_KEY = "gun-plani.tasks.v1";
var LOCALE_KEY = "gun-plani.locale.v1";
function loadTasks() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(TASKS_KEY);
		if (!raw) return [];
		return TaskListSchema.parse(JSON.parse(raw));
	} catch {
		return [];
	}
}
function saveTasks(tasks) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
function loadLocale() {
	if (typeof window === "undefined") return "tr";
	const stored = window.localStorage.getItem(LOCALE_KEY);
	if (stored === "en" || stored === "tr") return stored;
	return navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
}
function saveLocale(locale) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(LOCALE_KEY, locale);
}
var PlannerContext = (0, import_react.createContext)(null);
function PlannerProvider({ children }) {
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [locale, setLocaleState] = (0, import_react.useState)("tr");
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [filter, setFilter] = (0, import_react.useState)("today");
	const [processing, setProcessing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setTasks(loadTasks());
		setLocaleState(loadLocale());
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated) saveTasks(tasks);
	}, [tasks, hydrated]);
	const setLocale = (0, import_react.useCallback)((next) => {
		setLocaleState(next);
		saveLocale(next);
	}, []);
	const todayTasks = (0, import_react.useMemo)(() => tasks.filter((task) => isDueToday(task.dueDate)).sort((a, b) => a.order - b.order), [tasks]);
	const visible = (0, import_react.useMemo)(() => {
		return filter === "today" ? todayTasks : tasks.filter((task) => isUpcoming(task.dueDate)).sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.order - b.order);
	}, [
		filter,
		tasks,
		todayTasks
	]);
	const completedToday = todayTasks.filter((task) => task.completed).length;
	const addManual = (0, import_react.useCallback)((title, dueDate) => {
		const trimmed = title.trim();
		if (!trimmed) return;
		setTasks((prev) => applyAction(prev, {
			intent: "add",
			tasks: [{
				title: trimmed,
				dueDate: dueDate ?? "today"
			}]
		}));
	}, []);
	const toggle = (0, import_react.useCallback)((id) => {
		setTasks((prev) => prev.map((task) => task.id === id ? {
			...task,
			completed: !task.completed
		} : task));
	}, []);
	const updateTitle = (0, import_react.useCallback)((id, title) => {
		const trimmed = title.trim();
		if (!trimmed) return;
		setTasks((prev) => prev.map((task) => task.id === id ? {
			...task,
			title: trimmed
		} : task));
	}, []);
	const remove = (0, import_react.useCallback)((id) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
	}, []);
	const processUtterance = (0, import_react.useCallback)(async (text) => {
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
				dueDate: task.dueDate
			}))
		};
		try {
			const result = await interpretSpeech({ data: payload });
			if (result.ok) {
				setTasks((prev) => applyAction(prev, result.action, today));
				return result.action.message ?? null;
			}
		} catch {} finally {
			setProcessing(false);
		}
		const local = interpretLocally(trimmed, locale, snapshot);
		setTasks((prev) => applyAction(prev, local, today));
		return local.message ?? null;
	}, [
		locale,
		tasks,
		todayTasks
	]);
	const value = (0, import_react.useMemo)(() => ({
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
		processing
	}), [
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
		processing
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlannerContext.Provider, {
		value,
		children
	});
}
function usePlanner() {
	const ctx = (0, import_react.useContext)(PlannerContext);
	if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
	return ctx;
}
var copy = {
	tr: {
		appName: "Gün Planı",
		today: "Bugün",
		upcoming: "Yaklaşan",
		progress: "Günlük ilerleme",
		emptyToday: "Bugün için henüz bir plan yok.",
		emptyUpcoming: "Yaklaşan görev yok.",
		emptyHint: "Mikrofonla anlatın veya + ile ekleyin.",
		addPlaceholder: "Görev yazın…",
		add: "Ekle",
		cancel: "Vazgeç",
		save: "Kaydet",
		edit: "Düzenle",
		delete: "Sil",
		listen: "Dinleniyor…",
		speakHint: "Planlarınızı söyleyin. Bitince durun.",
		mic: "Sesli komut",
		micOff: "Tarayıcı sesi desteklemiyor",
		processing: "Anlıyorum…",
		done: "Tamamlandı",
		open: "Açık",
		of: "/",
		lang: "EN",
		noSpeech: "Ses algılanamadı. Tekrar deneyin.",
		aiUnavailable: "Yapay zeka şu an yok. Yerel kurallarla işlendi.",
		understood: "Anlaşıldı"
	},
	en: {
		appName: "Day Plan",
		today: "Today",
		upcoming: "Upcoming",
		progress: "Daily progress",
		emptyToday: "No plans for today yet.",
		emptyUpcoming: "No upcoming tasks.",
		emptyHint: "Speak your plan or add with +.",
		addPlaceholder: "Write a task…",
		add: "Add",
		cancel: "Cancel",
		save: "Save",
		edit: "Edit",
		delete: "Delete",
		listen: "Listening…",
		speakHint: "Say your plans. Stop when you are done.",
		mic: "Voice command",
		micOff: "Voice is not supported here",
		processing: "Understanding…",
		done: "Done",
		open: "Open",
		of: "/",
		lang: "TR",
		noSpeech: "Nothing heard. Try again.",
		aiUnavailable: "AI is unavailable. Applied local rules.",
		understood: "Understood"
	}
};
function t(locale) {
	return copy[locale];
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function ProgressRing({ value, total, label }) {
	const pct = total === 0 ? 0 : Math.round(value / total * 100);
	const r = 18;
	const c = 2 * Math.PI * r;
	const dash = c * (pct / 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		"aria-label": `${label} ${value} / ${total}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 44 44",
			className: "size-12",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "22",
				r,
				fill: "none",
				stroke: "var(--color-line)",
				strokeWidth: "4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "22",
				r,
				fill: "none",
				stroke: "var(--color-accent)",
				strokeWidth: "4",
				strokeLinecap: "round",
				strokeDasharray: `${dash} ${c}`,
				transform: "rotate(-90 22 22)"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-display text-lg tabular-nums leading-none text-ink",
			children: [value, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted",
				children: ["/", total]
			})]
		})] })]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-transform transition-opacity duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			ghost: "bg-transparent text-ink hover:bg-ink/5 border border-transparent",
			outline: "border border-line bg-surface text-ink hover:bg-bg",
			danger: "bg-danger text-accent-fg hover:opacity-90"
		},
		size: {
			md: "h-11 px-4 text-sm rounded-[var(--radius-md)]",
			lg: "h-14 px-5 text-base rounded-[var(--radius-lg)]",
			icon: "size-12 rounded-[var(--radius-md)]",
			pill: "h-11 px-4 rounded-full text-sm"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function TaskRow({ task, index, locale, showDate, onToggle, onSave, onDelete }) {
	const copy = t(locale);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(task.title);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cn("group flex items-start gap-3 rounded-[var(--radius-lg)] border border-line bg-surface px-3 py-3", task.completed && "opacity-70"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-2 w-6 shrink-0 text-center font-display text-sm tabular-nums text-muted",
				children: index
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onToggle,
				"aria-pressed": task.completed,
				"aria-label": task.completed ? copy.done : copy.open,
				className: cn("mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border transition-colors duration-[var(--motion-quick)]", task.completed ? "border-done bg-done text-accent-fg" : "border-line bg-bg text-ink/0 hover:border-accent"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-5",
					strokeWidth: 2.25
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 pt-1.5",
				children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					className: "h-10 w-full rounded-[var(--radius-sm)] border border-line bg-bg px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30",
					autoFocus: true,
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							onSave(draft);
							setEditing(false);
						}
						if (e.key === "Escape") setEditing(false);
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("text-base leading-snug text-ink", task.completed && "text-muted line-through"),
					children: task.title
				}), showDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: formatShortDate(task.dueDate, locale)
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 items-center gap-1",
				children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "size-11",
					"aria-label": copy.save,
					onClick: () => {
						onSave(draft);
						setEditing(false);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "size-11",
					"aria-label": copy.cancel,
					onClick: () => setEditing(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "size-11",
					"aria-label": copy.edit,
					onClick: () => {
						setDraft(task.title);
						setEditing(true);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "size-11 text-danger",
					"aria-label": copy.delete,
					onClick: onDelete,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})] })
			})
		]
	});
}
function getCtor() {
	if (typeof window === "undefined") return null;
	const w = window;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
function speechSupported() {
	return Boolean(getCtor());
}
function startListening(options) {
	const Ctor = getCtor();
	if (!Ctor) {
		options.onError("unsupported");
		return null;
	}
	const rec = new Ctor();
	rec.lang = options.lang;
	rec.continuous = true;
	rec.interimResults = true;
	rec.maxAlternatives = 1;
	let finalText = "";
	rec.onresult = (event) => {
		let interim = "";
		for (let i = event.resultIndex; i < event.results.length; i += 1) {
			const result = event.results[i];
			const piece = result[0]?.transcript ?? "";
			if (result.isFinal) finalText += `${piece} `;
			else interim += piece;
		}
		const live = `${finalText}${interim}`.trim();
		if (live) options.onInterim(live);
	};
	rec.onerror = (event) => {
		if (event.error === "no-speech") options.onError("no-speech");
		else if (event.error !== "aborted") options.onError(event.error);
	};
	rec.onend = () => {
		const text = finalText.trim();
		if (text) options.onFinal(text);
		options.onEnd();
	};
	try {
		rec.start();
	} catch {
		options.onError("start-failed");
		return null;
	}
	return { stop: () => {
		try {
			rec.stop();
		} catch {}
	} };
}
function VoiceBar() {
	const { locale, addManual, processUtterance, processing } = usePlanner();
	const copy = t(locale);
	const [openAdd, setOpenAdd] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [listening, setListening] = (0, import_react.useState)(false);
	const [live, setLive] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [supported, setSupported] = (0, import_react.useState)(false);
	const handle = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setSupported(speechSupported());
		return () => handle.current?.stop();
	}, []);
	async function handleFinal(text) {
		setLive(text);
		const msg = await processUtterance(text);
		setNotice(msg);
		setTimeout(() => setNotice(null), 2400);
		setLive("");
	}
	function toggleListen() {
		if (listening) {
			handle.current?.stop();
			handle.current = null;
			setListening(false);
			return;
		}
		setNotice(null);
		setLive("");
		setListening(true);
		handle.current = startListening({
			lang: locale === "tr" ? "tr-TR" : "en-US",
			onInterim: setLive,
			onFinal: (text) => {
				handleFinal(text);
			},
			onError: (err) => {
				setNotice(err === "no-speech" ? copy.noSpeech : copy.micOff);
				setListening(false);
			},
			onEnd: () => {
				setListening(false);
				handle.current = null;
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky bottom-0 z-20 border-t border-line bg-bg/95 px-4 pb-[max(4.5rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm",
		children: [
			openAdd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mb-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					addManual(draft);
					setDraft("");
					setOpenAdd(false);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: copy.addPlaceholder,
						className: "h-12 min-w-0 flex-1 rounded-[var(--radius-md)] border border-line bg-surface px-4 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30",
						autoFocus: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: copy.add
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => setOpenAdd(false),
						children: copy.cancel
					})
				]
			}) : null,
			(listening || processing || live || notice) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-2 text-center text-sm text-muted",
				children: [processing ? copy.processing : listening ? copy.listen : notice, live && !processing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-ink",
					children: live
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-md items-center justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "icon",
					"aria-label": copy.add,
					onClick: () => setOpenAdd((v) => !v),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "lg",
					"aria-label": copy.mic,
					disabled: !supported,
					onClick: toggleListen,
					className: cn("min-w-44", listening && "bg-danger"),
					children: [listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" }), listening ? copy.listen : copy.mic]
				})]
			})
		]
	});
}
function PlannerApp() {
	const { hydrated, locale, setLocale, filter, setFilter, visible, todayTasks, completedToday, toggle, updateTitle, remove } = usePlanner();
	const copy = t(locale);
	const now = /* @__PURE__ */ new Date();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-xl flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-5 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.18em] text-muted",
							children: copy.appName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-3xl font-medium tracking-tight text-ink",
							children: formatLongDate(now, locale)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLocale(locale === "tr" ? "en" : "tr"),
							className: "h-11 rounded-full border border-line bg-surface px-4 text-xs font-medium tracking-wide text-ink",
							"aria-label": copy.lang,
							children: copy.lang
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, {
							value: completedToday,
							total: todayTasks.length,
							label: copy.progress
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex rounded-[var(--radius-lg)] border border-line bg-surface p-1",
						children: ["today", "upcoming"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFilter(key),
							className: cn("h-11 flex-1 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-[var(--motion-fast)]", filter === key ? "bg-accent text-accent-fg" : "text-muted hover:text-ink"),
							children: key === "today" ? copy.today : copy.upcoming
						}, key))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 px-4 pb-4",
				children: !hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-[var(--radius-lg)] bg-line/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-[var(--radius-lg)] bg-line/40" })]
				}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-xl)] border border-dashed border-line bg-surface px-6 py-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl text-ink",
						children: filter === "today" ? copy.emptyToday : copy.emptyUpcoming
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: copy.emptyHint
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-2",
					children: visible.map((task, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
						task,
						index: i + 1,
						locale,
						showDate: filter === "upcoming",
						onToggle: () => toggle(task.id),
						onSave: (title) => updateTitle(task.id, title),
						onDelete: () => remove(task.id)
					}, task.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceBar, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlannerProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlannerApp, {}) });
}
//#endregion
export { Home as component };
