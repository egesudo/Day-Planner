import type { GrokAction, Locale, Task } from "./types";

const ORDINAL_MAP: Record<string, number> = {
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
  tenth: 10,
};

function findIndex(text: string): number | undefined {
  const numbered = text.match(/\b(\d+)\.?\s*(görev|plan|task|planlama)?/i);
  if (numbered) {
    const n = Number(numbered[1]);
    if (n > 0) return n;
  }
  const lower = text.toLowerCase();
  for (const [word, index] of Object.entries(ORDINAL_MAP)) {
    if (lower.includes(word)) return index;
  }
  return undefined;
}

function splitItems(text: string): string[] {
  return text
    .split(/[,;\n]| ve | and | sonra | then /i)
    .map((part) =>
      part.replace(/^(bugün|yarın|today|tomorrow|please|lütfen)\s+/i, "").trim(),
    )
    .filter((part) => part.length > 1);
}

function extractRename(text: string): string | undefined {
  const match = text.match(
    /(?:olarak|adı\s+|adını\s+|to|as)\s+["']?(.+?)["']?$/i,
  );
  const title = match?.[1]?.trim();
  return title && title.length > 1 ? title : undefined;
}

export function interpretLocally(
  text: string,
  _locale: Locale,
  _tasks: Task[],
): GrokAction {
  const raw = text.trim();
  const lower = raw.toLowerCase();

  const complete =
    /(bitirdim|tamamladım|tamamladim|\bbitti\b|finished|\bcompleted\b|\bdone\b|işaretle.*tamam)/.test(
      lower,
    );
  const uncomplete =
    /geri al|tamamlanmadı|tamamlanmadi|uncomplete|\bnot done\b|reopen/.test(
      lower,
    );
  const del = /(\bsil\b|kaldır|kaldir|\bdelete\b|\bremove\b)/.test(lower);
  const edit =
    /(düzenle|duzenle|değiştir|degistir|\brename\b|\bedit\b)/.test(lower);

  const targetIndex = findIndex(raw);

  if (complete && !uncomplete) {
    return { intent: "complete", targetIndex, message: raw };
  }
  if (uncomplete) {
    return { intent: "uncomplete", targetIndex, message: raw };
  }
  if (del) {
    return { intent: "delete", targetIndex, message: raw };
  }
  if (edit) {
    return {
      intent: "edit",
      targetIndex,
      newTitle: extractRename(raw),
      message: raw,
    };
  }

  const titles = splitItems(raw).filter(
    (item) => !/^(bugün|yarın|today|tomorrow)$/i.test(item),
  );
  if (titles.length === 0) return { intent: "none", message: raw };

  const dueDate = /yarın|yarin|tomorrow/.test(lower)
    ? "tomorrow"
    : /bugün|bugun|today/.test(lower)
      ? "today"
      : null;

  return {
    intent: "add",
    tasks: titles.map((title) => ({ title, dueDate })),
    message: raw,
  };
}
