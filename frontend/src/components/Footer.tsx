export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-[var(--ink-muted)] sm:flex-row">
        <div className="flex items-center gap-2 font-[family-name:var(--font-display)]">
          <span className="font-bold text-[var(--ink)]">
            DermaScan
            <span className="font-semibold text-[var(--teal)]">AI</span>
          </span>
          <span>© 2026</span>
          <span>•</span>
          <span>HAM10000 Open Research</span>
        </div>

        <div className="flex items-center gap-6 font-[family-name:var(--font-display)] font-medium">
          <a
            href="https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[var(--teal)]"
          >
            Kaggle Dataset
          </a>

          <a
            href="https://github.com/Vitz15/DermaScanAI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--teal)]"
          >
            GitHub
            <span className="material-symbols-outlined text-[11px]" aria-hidden>
              arrow_outward
            </span>
          </a>

          <a
            href="#demo"
            className="transition-colors hover:text-[var(--teal)]"
          >
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
