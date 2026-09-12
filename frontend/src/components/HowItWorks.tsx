const STEPS = [
  {
    number: "01",
    title: "Spatial Feature Extraction",
    description:
      "The EfficientNetB3 backbone scans microscopic tissue patterns, edge contour asymmetry, and melanin pigment distribution.",
    meta: "Input Res: 224×224 (Normalized)",
    dot: "bg-[var(--teal)]",
    iconColor: "text-[var(--teal)]",
  },
  {
    number: "02",
    title: "Grad-CAM Heatmap",
    description:
      "Removes the black-box effect by projecting gradients onto the lesion, revealing the areas the model factors into its decision.",
    meta: "Layer: top_activation",
    dot: "bg-[var(--amber)]",
    iconColor: "text-[var(--amber)]",
  },
  {
    number: "03",
    title: "Gemini LLM Synthesis",
    description:
      "The LLM summarizes the mathematical probabilities into a concise, contextual explanation that's easy for a layperson to understand.",
    meta: "Model: Gemini 2.0 Flash",
    dot: "bg-indigo-500",
    iconColor: "text-indigo-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="inline-block rounded bg-[var(--teal-soft)] px-2.5 py-1 font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-widest text-[var(--teal)]">
          Processing Pipeline
        </span>

        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
          Transparent inference in three stages
        </h2>

        <p className="mt-3 text-sm text-[var(--ink-muted)] sm:text-base">
          From raw dermoscopic imagery to visual analysis and an
          easy-to-understand explanation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-colors hover:border-[var(--border-strong)]"
          >
            <div>
              <div
                className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] font-[family-name:var(--font-mono)] text-sm font-semibold ${step.iconColor}`}
              >
                {step.number}
              </div>

              <h3 className="mb-2 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--ink)]">
                {step.title}
              </h3>

              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                {step.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 border-t border-[var(--border)] pt-4 font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink-muted)]">
              <span className={`h-1.5 w-1.5 rounded-full ${step.dot}`} />
              {step.meta}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
