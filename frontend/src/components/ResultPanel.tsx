import Image from "next/image";
import ScanRing from "./ScanRing";
import ProbabilityBars from "./ProbabilityBars";
import { PredictResponse, getRiskTier } from "@/lib/types";

interface ResultPanelProps {
  result: PredictResponse;
  originalImageUrl: string;
  labels: Record<string, string>;
  onReset: () => void;
}

export default function ResultPanel({
  result,
  originalImageUrl,
  labels,
  onReset,
}: ResultPanelProps) {
  const {
    prediction,
    gradcam_heatmap,
    llm_explanation,
    disclaimer,
    processing_time_ms,
  } = result;

  const risk = getRiskTier(prediction.class);
  const confidencePct = prediction.confidence * 100;

  return (
    <div className="space-y-7 sm:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--teal)]" />
            <span className="font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--teal)]">
              Analysis Complete
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
            Analysis Results
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--ink-muted)]">
            Here are the model's classification results along with a
            visualization of the focus area and probability distribution.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
          <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--ink-muted)]">
            PROCESSING TIME
          </p>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--ink)]">
            {processing_time_ms} ms
          </p>
        </div>
      </div>

      {/* MAIN PREDICTION */}
      <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[var(--shadow-card)]">
        <div className="grid lg:grid-cols-[220px_1fr]">
          <div className="flex items-center justify-center border-b border-[var(--border)] bg-[var(--bg)] p-8 lg:border-b-0 lg:border-r">
            <ScanRing
              percentage={confidencePct}
              tone={risk.tone}
              size={170}
              strokeWidth={8}
            >
              <div className="text-center">
                <div className="font-[family-name:var(--font-mono)] text-3xl font-semibold tracking-tight text-[var(--ink)]">
                  {confidencePct.toFixed(0)}%
                </div>

                <div className="mt-1 text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                  confidence
                </div>
              </div>
            </ScanRing>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor:
                    risk.tone === "coral"
                      ? "var(--coral-soft)"
                      : "var(--teal-soft)",
                  color: risk.tone === "coral" ? "var(--coral)" : "var(--teal)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      risk.tone === "coral" ? "var(--coral)" : "var(--teal)",
                  }}
                />
                {risk.label}
              </span>

              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-muted)]">
                MODEL PREDICTION
              </span>
            </div>

            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink)]">
              {prediction.class_label_readable}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--ink-muted)]">
              This score indicates the model's level of confidence in the
              selected predicted class. This value is not a measure of medical
              diagnostic certainty.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-muted)]">
                EfficientNetB3
              </span>

              <span className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-muted)]">
                7 classes
              </span>

              <span className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-muted)]">
                Grad-CAM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL EVIDENCE */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--teal)]">
              Visual Explanation
            </p>

            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--ink)]">
              Understanding the model's focus
            </h3>
          </div>

          <span className="hidden text-xs text-[var(--ink-muted)] sm:block">
            Original vs Grad-CAM
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
            <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
              <Image
                src={originalImageUrl}
                alt="Uploaded skin lesion photo"
                width={600}
                height={600}
                className="result-image h-full w-full object-cover"
                unoptimized
              />

              <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 backdrop-blur">
                <span className="font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-wider text-[var(--ink)]">
                  Original
                </span>
              </div>
            </div>

            <figcaption className="px-5 py-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Analyzed photo
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">
                The original image submitted to the classification pipeline.
              </p>
            </figcaption>
          </figure>

          <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
            <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
              <Image
                src={`data:image/png;base64,${gradcam_heatmap}`}
                alt="Grad-CAM heatmap showing the model's focus area"
                width={600}
                height={600}
                className="result-image h-full w-full object-cover"
                unoptimized
              />

              <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 backdrop-blur">
                <span className="font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-wider text-[var(--teal)]">
                  Grad-CAM
                </span>
              </div>
            </div>

            <figcaption className="px-5 py-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Model focus area
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">
                The heatmap helps visualize the areas that contributed to the
                model's decision.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* EXPLANATION */}
      <section className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
        <div className="border-b border-[var(--border)] px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--teal-soft)]">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="1.7"
                aria-hidden
              >
                <path
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.16em] text-[var(--teal)]">
                Natural Language
              </p>

              <h3 className="mt-0.5 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--ink)]">
                Model explanation
              </h3>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-7">
          <p className="whitespace-pre-line text-sm leading-7 text-[var(--ink-soft)]">
            {llm_explanation}
          </p>
        </div>
      </section>

      {/* PROBABILITY */}
      <section className="rounded-[1.5rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-7">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--teal)]">
              Model Output
            </p>

            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--ink)]">
              Probability distribution
            </h3>
          </div>

          <span className="hidden text-right text-[10px] leading-4 text-[var(--ink-muted)] sm:block">
            All predicted
            <br />
            classes
          </span>
        </div>

        <ProbabilityBars
          probabilities={prediction.all_probabilities}
          labels={labels}
        />
      </section>

      {/* DISCLAIMER */}
      <section className="rounded-[1.5rem] border border-[var(--coral)]/15 bg-[var(--coral-soft)] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--coral)"
              strokeWidth="1.8"
              aria-hidden
            >
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>

          <div>
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--coral)]">
              Important note
            </p>

            <p className="mt-1.5 text-sm leading-6 text-[var(--ink-soft)]">
              {disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* RESET */}
      <div className="flex justify-center pt-1">
        <button
          onClick={onReset}
          className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-medium text-[var(--ink-soft)] shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-[var(--teal)]/30 hover:text-[var(--teal)] hover:shadow-[var(--shadow-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden
          >
            <path
              d="M3 12a9 9 0 109-9c-2.4 0-4.58.94-6.2 2.47L3 7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 3v4.5h4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Try Another Photo
        </button>
      </div>
    </div>
  );
}
