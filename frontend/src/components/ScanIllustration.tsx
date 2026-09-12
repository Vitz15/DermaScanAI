export default function ScanIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[500px]">
      {/* Ambient background */}
      <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--teal)]/10 blur-3xl" />

      {/* Main analysis panel */}
      <div className="absolute inset-[7%] overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[var(--shadow-float)]">
        {/* Header */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              AI ANALYSIS
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--ink)]">
              A transparent AI model
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[var(--teal-soft)] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--teal)]">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Scanner */}
        <div className="absolute inset-[18%] flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 260 260"
            fill="none"
            aria-hidden
          >
            <circle
              cx="130"
              cy="130"
              r="108"
              stroke="var(--border)"
              strokeWidth="1"
            />

            <circle
              className="ring-pulse"
              cx="130"
              cy="130"
              r="78"
              stroke="var(--teal)"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />

            <circle
              cx="130"
              cy="130"
              r="52"
              stroke="var(--teal)"
              strokeWidth="1.5"
              strokeDasharray="5 7"
            />

            <defs>
              <radialGradient id="lesionBlob" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--coral)" stopOpacity="0.7" />
                <stop
                  offset="55%"
                  stopColor="var(--amber)"
                  stopOpacity="0.32"
                />
                <stop
                  offset="100%"
                  stopColor="var(--teal)"
                  stopOpacity="0.08"
                />
              </radialGradient>
            </defs>

            <circle
              cx="130"
              cy="130"
              r="34"
              fill="url(#lesionBlob)"
              className="soft-pulse"
            />

            <line
              x1="130"
              y1="0"
              x2="130"
              y2="28"
              stroke="var(--teal)"
              strokeWidth="1.5"
            />

            <line
              x1="130"
              y1="232"
              x2="130"
              y2="260"
              stroke="var(--teal)"
              strokeWidth="1.5"
            />

            <line
              x1="0"
              y1="130"
              x2="28"
              y2="130"
              stroke="var(--teal)"
              strokeWidth="1.5"
            />

            <line
              x1="232"
              y1="130"
              x2="260"
              y2="130"
              stroke="var(--teal)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Bottom metadata */}
        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 border-t border-[var(--border)]">
          <div className="px-5 py-4">
            <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--ink-muted)]">
              MODEL
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--ink)]">
              EfficientNetB3
            </p>
          </div>

          <div className="border-l border-[var(--border)] px-5 py-4">
            <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--ink-muted)]">
              EXPLANATION
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--ink)]">
              Grad-CAM
            </p>
          </div>
        </div>
      </div>

      {/* Confidence floating card */}
      <div className="absolute -right-1 top-[17%] flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-[var(--shadow-float)] sm:-right-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--amber-soft)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--amber)]" />
        </div>

        <div>
          <p className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--ink)]">
            94.2%
          </p>
          <p className="text-[10px] text-[var(--ink-muted)]">
            model confidence
          </p>
        </div>
      </div>

      {/* Grad-CAM floating card */}
      <div className="absolute -left-1 bottom-[20%] flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-[var(--shadow-float)] sm:-left-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--teal-soft)]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--teal)"
            strokeWidth="1.8"
            aria-hidden
          >
            <path
              d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--ink)]">
            Grad-CAM active
          </p>
          <p className="text-[10px] text-[var(--ink-muted)]">
            Visual explanation
          </p>
        </div>
      </div>
    </div>
  );
}
