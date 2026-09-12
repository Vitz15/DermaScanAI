import { HIGH_RISK_CLASSES } from "@/lib/types";

interface ProbabilityBarsProps {
  probabilities: Record<string, number>;
  labels: Record<string, string>;
}

export default function ProbabilityBars({
  probabilities,
  labels,
}: ProbabilityBarsProps) {
  const sorted = Object.entries(probabilities).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="space-y-5">
      {sorted.map(([cls, value], index) => {
        const isHighRisk = HIGH_RISK_CLASSES.has(cls);
        const pct = (value * 100).toFixed(1);

        return (
          <div key={cls}>
            <div className="mb-2.5 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-5 shrink-0 font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={[
                    "truncate text-sm",
                    index === 0
                      ? "font-semibold text-[var(--ink)]"
                      : "text-[var(--ink-soft)]",
                  ].join(" ")}
                >
                  {labels[cls] ?? cls}
                </span>
              </div>

              <span
                className={[
                  "shrink-0 font-[family-name:var(--font-mono)] text-xs",
                  index === 0
                    ? "font-semibold text-[var(--ink)]"
                    : "text-[var(--ink-muted)]",
                ].join(" ")}
              >
                {pct}%
              </span>
            </div>

            <div className="relative h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isHighRisk
                    ? "var(--coral)"
                    : "var(--teal)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}