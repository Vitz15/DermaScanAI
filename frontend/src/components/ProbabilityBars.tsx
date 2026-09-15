import { HIGH_RISK_CLASSES } from "@/lib/types";

interface ProbabilityBarsProps {
  probabilities: Record<string, number>;
  labels: Record<string, string>;
}

export default function ProbabilityBars({
  probabilities,
  labels,
}: ProbabilityBarsProps) {
  const sorted = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  const topClass = sorted[0]?.[0];
  const isTopHighRisk = topClass ? HIGH_RISK_CLASSES.has(topClass) : false;

  return (
    <div className="space-y-2.5 pt-0.5">
      {sorted.map(([cls, value], index) => {
        const pct = (value * 100).toFixed(1);
        const isTop = index === 0;
        const isSecond = index === 1;

        if (isTop) {
          const dotColor = isTopHighRisk ? "bg-rose-500" : "bg-teal-500";
          const barColor = isTopHighRisk ? "bg-rose-500" : "bg-teal-600";
          const textColor = isTopHighRisk ? "text-rose-600" : "text-teal-600";
          const cardBg = isTopHighRisk
            ? "bg-rose-50/50 border-rose-200/60"
            : "bg-teal-50/50 border-teal-200/60";
          const badgeStyle = isTopHighRisk
            ? "bg-rose-100 text-rose-700"
            : "bg-teal-100 text-teal-700";

          return (
            <div key={cls} className={`space-y-1 p-2 rounded-lg border ${cardBg}`}>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                  <span className="font-bold text-slate-900 truncate">
                    {labels[cls] ?? cls}{" "}
                    <span className="font-[family-name:var(--font-mono)] font-normal text-slate-500 text-[11px]">
                      ({cls})
                    </span>
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-[family-name:var(--font-mono)] font-bold ${badgeStyle} shrink-0`}
                  >
                    PRIMARY SUSPECT
                  </span>
                </div>
                <span
                  className={`font-[family-name:var(--font-mono)] font-bold ${textColor} text-xs shrink-0 ml-2`}
                >
                  {pct}%
                </span>
              </div>
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`${barColor} h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        }

        if (isSecond) {
          return (
            <div
              key={cls}
              className="space-y-1 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">
                    {labels[cls] ?? cls}{" "}
                    <span className="font-[family-name:var(--font-mono)] font-normal text-slate-500 text-[11px]">
                      ({cls})
                    </span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-[family-name:var(--font-mono)] font-medium bg-slate-100 text-slate-600 shrink-0">
                    DIFFERENTIAL
                  </span>
                </div>
                <span className="font-[family-name:var(--font-mono)] font-semibold text-slate-700 text-xs shrink-0 ml-2">
                  {pct}%
                </span>
              </div>
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        }

        return (
          <div
            key={cls}
            className="space-y-1 px-2 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
          >
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="text-slate-700 truncate text-[11px]">
                  {labels[cls] ?? cls}{" "}
                  <span className="font-[family-name:var(--font-mono)] font-normal text-slate-400 text-[10px]">
                    ({cls})
                  </span>
                </span>
              </div>
              <span className="font-[family-name:var(--font-mono)] font-semibold text-slate-600 text-xs shrink-0 ml-2">
                {pct}%
              </span>
            </div>
            <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-400 h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
