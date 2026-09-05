import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/lib/planner/dates";
import { t } from "@/lib/planner/i18n";
import type { Locale, Task } from "@/lib/planner/types";
import { cn } from "@/lib/utils";

export function TaskRow({
  task,
  index,
  locale,
  showDate,
  onToggle,
  onSave,
  onDelete,
}: {
  task: Task;
  index: number;
  locale: Locale;
  showDate?: boolean;
  onToggle: () => void;
  onSave: (title: string) => void;
  onDelete: () => void;
}) {
  const copy = t(locale);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  return (
    <li
      className={cn(
        "group flex items-start gap-3 rounded-[var(--radius-lg)] border border-line bg-surface px-3 py-3",
        task.completed && "opacity-70",
      )}
    >
      <span className="mt-2 w-6 shrink-0 text-center font-display text-sm tabular-nums text-muted">
        {index}
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={task.completed}
        aria-label={task.completed ? copy.done : copy.open}
        className={cn(
          "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border transition-colors duration-[var(--motion-quick)]",
          task.completed
            ? "border-done bg-done text-accent-fg"
            : "border-line bg-bg text-ink/0 hover:border-accent",
        )}
      >
        <Check className="size-5" strokeWidth={2.25} />
      </button>
      <div className="min-w-0 flex-1 pt-1.5">
        {editing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-10 w-full rounded-[var(--radius-sm)] border border-line bg-bg px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSave(draft);
                setEditing(false);
              }
              if (e.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <p
            className={cn(
              "text-base leading-snug text-ink",
              task.completed && "text-muted line-through",
            )}
          >
            {task.title}
          </p>
        )}
        {showDate ? (
          <p className="mt-1 text-xs text-muted">{formatShortDate(task.dueDate, locale)}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              aria-label={copy.save}
              onClick={() => {
                onSave(draft);
                setEditing(false);
              }}
            >
              <Check className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              aria-label={copy.cancel}
              onClick={() => setEditing(false)}
            >
              <X className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              aria-label={copy.edit}
              onClick={() => {
                setDraft(task.title);
                setEditing(true);
              }}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 text-danger"
              aria-label={copy.delete}
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
