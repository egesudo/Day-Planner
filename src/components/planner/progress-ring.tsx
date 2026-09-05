export function ProgressRing({
  value,
  total,
  label,
}: {
  value: number;
  total: number;
  label: string;
}) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  const r = 18;
  const c = 2 * Math.PI * r;
  const dash = c * (pct / 100);

  return (
    <div className="flex items-center gap-3" aria-label={`${label} ${value} / ${total}`}>
      <svg viewBox="0 0 44 44" className="size-12" aria-hidden="true">
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="4"
        />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 22 22)"
        />
      </svg>
      <div>
        <p className="text-xs tracking-wide text-muted">{label}</p>
        <p className="font-display text-lg tabular-nums leading-none text-ink">
          {value}
          <span className="text-muted">/{total}</span>
        </p>
      </div>
    </div>
  );
}
