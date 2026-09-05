import { formatLongDate } from "@/lib/planner/dates";
import { usePlanner } from "@/lib/planner/context";
import { t } from "@/lib/planner/i18n";
import { cn } from "@/lib/utils";
import { ProgressRing } from "./progress-ring";
import { TaskRow } from "./task-row";
import { VoiceBar } from "./voice-bar";

export function PlannerApp() {
  const {
    hydrated,
    locale,
    setLocale,
    filter,
    setFilter,
    visible,
    todayTasks,
    completedToday,
    toggle,
    updateTitle,
    remove,
  } = usePlanner();
  const copy = t(locale);
  const now = new Date();

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col">
      <header className="px-5 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{copy.appName}</p>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
              {formatLongDate(now, locale)}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setLocale(locale === "tr" ? "en" : "tr")}
            className="h-11 rounded-full border border-line bg-surface px-4 text-xs font-medium tracking-wide text-ink"
            aria-label={copy.lang}
          >
            {copy.lang}
          </button>
        </div>
        <div className="mt-6">
          <ProgressRing
            value={completedToday}
            total={todayTasks.length}
            label={copy.progress}
          />
        </div>
        <div className="mt-6 flex rounded-[var(--radius-lg)] border border-line bg-surface p-1">
          {(["today", "upcoming"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "h-11 flex-1 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-[var(--motion-fast)]",
                filter === key ? "bg-accent text-accent-fg" : "text-muted hover:text-ink",
              )}
            >
              {key === "today" ? copy.today : copy.upcoming}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 pb-4">
        {!hydrated ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-[var(--radius-lg)] bg-line/50" />
            <div className="h-16 animate-pulse rounded-[var(--radius-lg)] bg-line/40" />
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-line bg-surface px-6 py-12 text-center">
            <p className="font-display text-xl text-ink">
              {filter === "today" ? copy.emptyToday : copy.emptyUpcoming}
            </p>
            <p className="mt-2 text-sm text-muted">{copy.emptyHint}</p>
          </div>
        ) : (
          <ol className="space-y-2">
            {visible.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                index={i + 1}
                locale={locale}
                showDate={filter === "upcoming"}
                onToggle={() => toggle(task.id)}
                onSave={(title) => updateTitle(task.id, title)}
                onDelete={() => remove(task.id)}
              />
            ))}
          </ol>
        )}
      </main>

      <VoiceBar />
    </div>
  );
}
