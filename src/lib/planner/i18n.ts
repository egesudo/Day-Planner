import type { Locale } from "./types";

export type Copy = {
  appName: string;
  today: string;
  upcoming: string;
  progress: string;
  emptyToday: string;
  emptyUpcoming: string;
  emptyHint: string;
  addPlaceholder: string;
  add: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  listen: string;
  speakHint: string;
  mic: string;
  micOff: string;
  processing: string;
  done: string;
  open: string;
  of: string;
  lang: string;
  noSpeech: string;
  aiUnavailable: string;
  understood: string;
};

const copy: Record<Locale, Copy> = {
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
    understood: "Anlaşıldı",
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
    understood: "Understood",
  },
};

export function t(locale: Locale): Copy {
  return copy[locale];
}
