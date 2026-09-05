import { createServerFn } from "@tanstack/react-start";
import { GrokActionSchema, InterpretInputSchema } from "./schema";
import type { GrokAction } from "./types";

function extractJson(text: string): unknown {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object");
  return JSON.parse(raw.slice(start, end + 1));
}

export const interpretSpeech = createServerFn({ method: "POST" })
  .validator((input: unknown) => InterpretInputSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; action: GrokAction } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "unavailable" };
    }

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
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0,
          max_tokens: 500,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) return { ok: false, error: `xAI API error ${res.status}` };
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = body.choices?.[0]?.message?.content ?? "";
      const parsed = GrokActionSchema.parse(extractJson(content));
      return { ok: true, action: parsed };
    } catch {
      return { ok: false, error: "parse" };
    }
  });
