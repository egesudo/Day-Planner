import { Mic, Plus, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePlanner } from "@/lib/planner/context";
import { t } from "@/lib/planner/i18n";
import { speechSupported, startListening, type SpeechHandle } from "@/lib/planner/speech";
import { cn } from "@/lib/utils";

export function VoiceBar() {
  const { locale, addManual, processUtterance, processing } = usePlanner();
  const copy = t(locale);
  const [openAdd, setOpenAdd] = useState(false);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [live, setLive] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const handle = useRef<SpeechHandle | null>(null);

  useEffect(() => {
    setSupported(speechSupported());
    return () => handle.current?.stop();
  }, []);

  async function handleFinal(text: string) {
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
        void handleFinal(text);
      },
      onError: (err) => {
        setNotice(err === "no-speech" ? copy.noSpeech : copy.micOff);
        setListening(false);
      },
      onEnd: () => {
        setListening(false);
        handle.current = null;
      },
    });
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-line bg-bg/95 px-4 pb-[max(4.5rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
      {openAdd ? (
        <form
          className="mb-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addManual(draft);
            setDraft("");
            setOpenAdd(false);
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={copy.addPlaceholder}
            className="h-12 min-w-0 flex-1 rounded-[var(--radius-md)] border border-line bg-surface px-4 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
            autoFocus
          />
          <Button type="submit">{copy.add}</Button>
          <Button type="button" variant="ghost" onClick={() => setOpenAdd(false)}>
            {copy.cancel}
          </Button>
        </form>
      ) : null}

      {(listening || processing || live || notice) && (
        <p className="mb-2 text-center text-sm text-muted">
          {processing ? copy.processing : listening ? copy.listen : notice}
          {live && !processing ? <span className="block text-ink">{live}</span> : null}
        </p>
      )}

      <div className="mx-auto flex max-w-md items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={copy.add}
          onClick={() => setOpenAdd((v) => !v)}
        >
          <Plus className="size-5" />
        </Button>
        <Button
          type="button"
          size="lg"
          aria-label={copy.mic}
          disabled={!supported}
          onClick={toggleListen}
          className={cn("min-w-44", listening && "bg-danger")}
        >
          {listening ? <Square className="size-4 fill-current" /> : <Mic className="size-5" />}
          {listening ? copy.listen : copy.mic}
        </Button>
      </div>
    </div>
  );
}
