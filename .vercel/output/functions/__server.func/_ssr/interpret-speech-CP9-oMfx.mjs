import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as InterpretInputSchema, t as GrokActionSchema } from "./schema-zPuaXbln.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interpret-speech-CP9-oMfx.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function extractJson(text) {
	const raw = text.match(/```json\s*([\s\S]*?)```/i)?.[1] ?? text;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("No JSON object");
	return JSON.parse(raw.slice(start, end + 1));
}
var interpretSpeech_createServerFn_handler = createServerRpc({
	id: "f4d658f73b65785a6eff8561baaa81eb1a60566527f0d3cac653e7b09869002d",
	name: "interpretSpeech",
	filename: "src/lib/planner/interpret-speech.ts"
}, (opts) => interpretSpeech.__executeServer(opts));
var interpretSpeech = createServerFn({ method: "POST" }).validator((input) => InterpretInputSchema.parse(input)).handler(interpretSpeech_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "unavailable"
	};
	const system = `You convert bilingual (Turkish/English) daily planner speech into ONE JSON object. Never add commentary.
Schema:
{"intent":"add"|"complete"|"uncomplete"|"edit"|"delete"|"none","language":"tr"|"en","tasks":[{"title":"string","dueDate":"YYYY-MM-DD"|"today"|"tomorrow"|null}],"targetIndex":1-based number among today's listed tasks,"targetTitle":"optional string","newTitle":"optional","message":"short confirmation in the user's language"}
Rules:
- "Birinci planlamayı/görevi bitirdim", "I finished the first task" → intent complete, targetIndex 1.
- Multiple plans in one utterance → intent add, one object per task, preserve order.
- If the user only lists plans, intent is add.
- dueDate: today unless they say tomorrow/yarın or a date.
- targetIndex is 1-based using the numbered task list provided.
- JSON only.`;
	const user = `Today: ${data.today}
Locale hint: ${data.locale}
Current tasks:
${data.tasks.map((task) => `${task.index}. ${task.title} [${task.completed ? "done" : "open"}] due ${task.dueDate}`).join("\n") || "(none)"}

Utterance:
${data.text}`;
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: 0,
				max_tokens: 500,
				messages: [{
					role: "system",
					content: system
				}, {
					role: "user",
					content: user
				}]
			})
		});
		if (!res.ok) return {
			ok: false,
			error: `xAI API error ${res.status}`
		};
		const content = (await res.json()).choices?.[0]?.message?.content ?? "";
		return {
			ok: true,
			action: GrokActionSchema.parse(extractJson(content))
		};
	} catch {
		return {
			ok: false,
			error: "parse"
		};
	}
});
//#endregion
export { interpretSpeech_createServerFn_handler };
