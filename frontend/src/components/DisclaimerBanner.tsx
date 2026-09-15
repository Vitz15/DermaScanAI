export default function DisclaimerBanner({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="border-b border-[var(--warn-border)] bg-[var(--warn-bg)] px-4 py-2.5 text-center">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 font-[family-name:var(--font-display)] text-xs font-medium text-[var(--warn-text)]">
        <span
          className="material-symbols-outlined shrink-0 text-sm text-[var(--warn-icon)]"
          aria-hidden
        >
          warning
        </span>
        <span>
          <strong>Clinical &amp; Regulatory Notice:</strong>{" "}
          {compact
            ? "Educational project — not a substitute for medical consultation."
            : "DermaScan AI is an open research & educational demonstration model based on the HAM10000 dataset. This system is NOT a diagnostic medical device and does not replace evaluation by a dermatology specialist."}
        </span>
      </div>
    </div>
  );
}
