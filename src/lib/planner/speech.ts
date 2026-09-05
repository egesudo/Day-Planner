export type SpeechHandle = {
  stop: () => void;
};

type SpeechCtor = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{
      isFinal: boolean;
      0: { transcript: string };
    }>;
  }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getCtor(): SpeechCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechCtor;
    webkitSpeechRecognition?: SpeechCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function speechSupported(): boolean {
  return Boolean(getCtor());
}

export function startListening(options: {
  lang: string;
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (message: string) => void;
  onEnd: () => void;
}): SpeechHandle | null {
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

  return {
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}
