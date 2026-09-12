import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/80 bg-[var(--bg)]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--teal)] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <span className="material-symbols-outlined text-lg" aria-hidden>
              health_and_safety
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-[var(--ink)]">
              DermaScan
              <span className="font-semibold text-[var(--teal)]">.ai</span>
            </span>
            <span className="rounded border border-[var(--teal)]/20 bg-[var(--teal-soft)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[var(--teal)]">
              Research
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 font-[family-name:var(--font-display)] text-sm font-medium text-[var(--ink-muted)] md:flex">
          <a href="#demo" className="font-semibold text-[var(--teal)]">
            Demo Workspace
          </a>
          <a
            href="#demo"
            className="transition-colors hover:text-[var(--teal)]"
          >
            Analysis Results
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--teal)]"
          >
            GitHub
            <span
              className="material-symbols-outlined text-[13px] opacity-70"
              aria-hidden
            >
              arrow_outward
            </span>
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--teal)] px-4 py-2 font-[family-name:var(--font-display)] text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--teal-deep)]"
          >
            Start Analysis
            <span className="material-symbols-outlined text-sm" aria-hidden>
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
