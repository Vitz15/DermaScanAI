"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ProbabilityBars from "./ProbabilityBars";
import { PredictResponse, getRiskTier } from "@/lib/types";
import ReactMarkdown from "react-markdown";

interface ResultPanelProps {
  result: PredictResponse;
  originalImageUrl: string;
  labels: Record<string, string>;
  onReset: () => void;
  analysisId: string;
  timestamp: Date;
}

const CLASS_DESCRIPTIONS: Record<string, string> = {
  mel: "A serious form of skin cancer",
  bcc: "The most common type of skin cancer",
  akiec: "A precancerous skin condition",
  nv: "A common, non-cancerous mole",
  bkl: "A non-cancerous skin growth",
  df: "A benign skin growth",
  vasc: "A benign vascular growth",
};

function parseGeminiExplanation(text: string) {
  const sections = {
    overview: "",
    whatImagesShow: [] as string[],
    whyThisMatters: "",
    recommendedNextStep: "",
  };

  if (!text) return sections;

  const overviewMatch = text.match(
    /##\s*Overview\s*\n([\s\S]*?)(?=##\s*What the Images Show|$)/i,
  );
  const imagesMatch = text.match(
    /##\s*What the Images Show\s*\n([\s\S]*?)(?=##\s*Why This Matters|$)/i,
  );
  const mattersMatch = text.match(
    /##\s*Why This Matters\s*\n([\s\S]*?)(?=##\s*Recommended Next Step|$)/i,
  );
  const nextStepMatch = text.match(
    /##\s*Recommended Next Step\s*\n([\s\S]*?)$/i,
  );

  if (overviewMatch) sections.overview = overviewMatch[1].trim();
  if (mattersMatch) sections.whyThisMatters = mattersMatch[1].trim();
  if (nextStepMatch) sections.recommendedNextStep = nextStepMatch[1].trim();

  if (imagesMatch) {
    const rawImagesText = imagesMatch[1].trim();
    const bulletLines = rawImagesText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-") || line.startsWith("*"))
      .map((line) => line.replace(/^[-*]\s*/, "").trim());

    if (bulletLines.length > 0) {
      sections.whatImagesShow = bulletLines;
    } else {
      sections.whatImagesShow = [rawImagesText];
    }
  }

  if (
    !sections.overview &&
    sections.whatImagesShow.length === 0 &&
    !sections.whyThisMatters &&
    !sections.recommendedNextStep
  ) {
    sections.overview = text.trim();
  }

  return sections;
}

export default function ResultPanel({
  result,
  originalImageUrl,
  labels,
  onReset,
  analysisId,
  timestamp,
}: ResultPanelProps) {
  const {
    prediction,
    gradcam_heatmap,
    llm_explanation,
    disclaimer,
    processing_time_ms,
  } = result;

  const formattedTimestamp = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
  const risk = getRiskTier(prediction.class);
  const confidencePct = prediction.confidence * 100;
  const isHighRisk = risk.tone === "coral";

  const [heatmapOpacity, setHeatmapOpacity] = useState(80);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const toggleView = () => {
    if (showHeatmap) {
      setHeatmapOpacity(0);
      setShowHeatmap(false);
    } else {
      setHeatmapOpacity(80);
      setShowHeatmap(true);
    }
  };

  const explanationSections = useMemo(
    () => parseGeminiExplanation(llm_explanation),
    [llm_explanation],
  );

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, confidencePct));
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-[var(--ink-muted)]">
            <span className="rounded bg-[var(--surface)] px-2 py-0.5 font-medium text-slate-700">
              ID #{analysisId}
            </span>
            <span>•</span>
            <span>Calibrated Dermoscopy</span>
            <span>•</span>
            <span>{formattedTimestamp}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink)] md:text-[1.75rem]">
              Skin Lesion Analysis Report
            </h1>

            {isHighRisk && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-semibold tracking-wide text-rose-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                High Risk Indicated
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 border-t border-[var(--border)] pt-3 text-xs text-[var(--ink-muted)] md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div>
            <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
              Inference Time
            </span>
            <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--ink)]">
              {processing_time_ms} ms
            </span>
          </div>
          <div>
            <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
              Dataset Basis
            </span>
            <span className="text-sm font-medium text-[var(--ink)]">
              HAM10000 Test
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-7">
          <div className="flex h-full flex-col justify-between space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-xl text-[var(--teal)]"
                    aria-hidden
                  >
                    biotech
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--ink)] sm:text-base">
                    Grad-CAM &amp; Original Lesion View
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleView}
                    className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                  >
                    <span
                      className="material-symbols-outlined text-sm"
                      aria-hidden
                    >
                      compare
                    </span>
                    <span>
                      {showHeatmap ? "Mode: Overlay" : "Mode: Original"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                <Image
                  src={originalImageUrl}
                  alt="Uploaded dermoscopy image"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <Image
                  src={`data:image/png;base64,${gradcam_heatmap}`}
                  alt="Grad-CAM heatmap overlay"
                  fill
                  unoptimized
                  className="object-cover transition-opacity duration-150"
                  style={{ opacity: heatmapOpacity / 100 }}
                />

                <div className="absolute left-3 top-3 z-20 flex gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Dermoscopy Image
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/85 px-3 py-1.5 backdrop-blur-md">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-slate-300">
                    Min
                  </span>
                  <div className="h-2 w-20 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-600" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-slate-300">
                    Max
                  </span>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
                    <span
                      className="material-symbols-outlined text-sm text-[var(--teal)]"
                      aria-hidden
                    >
                      opacity
                    </span>
                    AI Heatmap Transparency
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[var(--teal)]">
                    {heatmapOpacity}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-[var(--ink-muted)]">
                    Original
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={heatmapOpacity}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setHeatmapOpacity(v);
                      setShowHeatmap(v > 0);
                    }}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[var(--teal)]"
                  />
                  <span className="text-[11px] font-medium text-[var(--ink-muted)]">
                    Full Heatmap
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-emerald-100/80 bg-emerald-50/50 p-3 text-xs text-slate-700">
              <span
                className="material-symbols-outlined mt-0.5 shrink-0 text-lg text-[var(--teal)]"
                aria-hidden
              >
                insights
              </span>
              <div className="space-y-0.5 leading-relaxed">
                <p className="font-semibold text-slate-900">
                  Model Attention Focus (Attention Map)
                </p>
                <p className="text-[11px] text-[var(--ink-muted)]">
                  Red intensity marks the highest feature contributions (such as
                  contour asymmetry and atypical pigment distribution) that most
                  strongly influenced this prediction.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5">
          <div className="flex h-full flex-col justify-between space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
            <div
              className={`relative overflow-hidden rounded-xl border p-4 ${
                isHighRisk
                  ? "border-rose-200/80 bg-rose-50"
                  : "border-teal-200/80 bg-teal-50/60"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-2 ${
                  isHighRisk ? "border-rose-200/60" : "border-teal-200/60"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`material-symbols-outlined text-base ${
                      isHighRisk ? "text-rose-600" : "text-[var(--teal)]"
                    }`}
                  >
                    {isHighRisk ? "warning" : "verified_user"}
                  </span>
                  <span
                    className={`font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-wider ${
                      isHighRisk ? "text-rose-700" : "text-[var(--teal)]"
                    }`}
                  >
                    Primary Clinical Prediction
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold shadow-sm ${
                    isHighRisk
                      ? "border-rose-200/80 text-rose-700"
                      : "border-teal-200/80 text-[var(--teal)]"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isHighRisk
                        ? "bg-rose-500 animate-pulse"
                        : "bg-[var(--teal)]"
                    }`}
                  />
                  {confidencePct >= 85
                    ? "High Confidence"
                    : confidencePct >= 60
                      ? "Moderate Confidence"
                      : "Low Confidence — Uncertain"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3">
                <div className="space-y-1">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-slate-900">
                    {prediction.class_label_readable}{" "}
                    <span
                      className={`font-extrabold ${
                        isHighRisk ? "text-rose-600" : "text-[var(--teal)]"
                      }`}
                    >
                      ({prediction.class.toUpperCase()})
                    </span>
                  </h2>
                  <p className="text-xs font-medium leading-normal text-slate-600">
                    {CLASS_DESCRIPTIONS[prediction.class] ||
                      "Dermatological Lesion"}
                  </p>
                  <div
                    className={`mt-1.5 inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-semibold ${
                      isHighRisk
                        ? "bg-rose-100/60 text-rose-700"
                        : "bg-teal-100/60 text-[var(--teal)]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isHighRisk ? "emergency" : "check_circle"}
                    </span>
                    <span>
                      {isHighRisk
                        ? "High Risk Indicated"
                        : "Lower Risk Indicated"}
                    </span>
                  </div>
                </div>

                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
                    <circle
                      className={
                        isHighRisk ? "text-rose-200/80" : "text-teal-200/80"
                      }
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="30"
                      cx="36"
                      cy="36"
                    />
                    <circle
                      className={`${
                        isHighRisk ? "text-rose-600" : "text-[var(--teal)]"
                      } transition-all duration-700 ease-out motion-reduce:transition-none`}
                      strokeWidth="6"
                      strokeDasharray={circumference.toFixed(1)}
                      strokeDashoffset={strokeDashoffset.toFixed(2)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="30"
                      cx="36"
                      cy="36"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="font-[family-name:var(--font-display)] text-base font-extrabold leading-none text-slate-900">
                      {confidencePct.toFixed(1)}
                      <span
                        className={`text-[10px] ${
                          isHighRisk ? "text-rose-600" : "text-[var(--teal)]"
                        }`}
                      >
                        %
                      </span>
                    </span>
                    <span className="mt-0.5 font-[family-name:var(--font-mono)] text-[8px] font-semibold uppercase text-slate-500">
                      Confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5">
                <div className="flex items-center gap-1.5 font-[family-name:var(--font-display)] text-xs font-bold text-slate-900">
                  <span className="material-symbols-outlined text-sm text-[var(--teal)]">
                    bar_chart
                  </span>
                  <span>Class Distribution (HAM10000)</span>
                </div>
                <span className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-slate-500">
                  7 Tested Diagnoses
                </span>
              </div>
              <ProbabilityBars
                probabilities={prediction.all_probabilities}
                labels={labels}
              />
            </div>

            <div className="space-y-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5 text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <span className="material-symbols-outlined text-sm text-[var(--teal)]">
                    verified_user
                  </span>
                  Model Evaluation Metrics (HAM10000)
                </span>
                <span className="rounded border border-[var(--teal)]/20 bg-[var(--teal-soft)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-[var(--teal)]">
                  Loss: -
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2">
                  <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-slate-500">
                    Sensitivity
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-slate-900">
                    -
                  </span>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2">
                  <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-slate-500">
                    Specificity
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-slate-900">
                    -
                  </span>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2">
                  <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-slate-500">
                    AUC-ROC
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--teal)]">
                    -
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50/40 to-[var(--card)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-col justify-between gap-3 border-b border-sky-100 pb-3.5 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200/60 bg-sky-100/70 px-3 py-1.5 text-xs font-semibold text-sky-800">
            <span className="material-symbols-outlined text-sm text-sky-600">
              auto_awesome
            </span>
            <span>Gemini AI Clinical Summary</span>
          </div>
          <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] text-slate-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span>
              Gemini 3.6 Flash / Clinical Multimodal Explanation Engine
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-200/80 bg-[var(--card)] p-5 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-[family-name:var(--font-display)] text-xs font-bold text-slate-900">
                <span className="material-symbols-outlined text-base text-[var(--teal)]">
                  description
                </span>
                <span>Model Explanation: Overview</span>
              </div>
              <div className="text-xs leading-relaxed text-[var(--ink-muted)]">
                <ReactMarkdown
                  components={{
                    p: ({ ...props }) => (
                      <p className="mb-2 leading-relaxed" {...props} />
                    ),
                    strong: ({ ...props }) => (
                      <strong
                        className="font-semibold text-[var(--ink)]"
                        {...props}
                      />
                    ),
                  }}
                >
                  {explanationSections.overview ||
                    "Overview explanation is being generated..."}
                </ReactMarkdown>
              </div>
            </div>

            {explanationSections.whyThisMatters && (
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 font-[family-name:var(--font-display)] text-xs font-bold text-slate-900">
                  <span className="material-symbols-outlined text-sm text-amber-600">
                    crisis_alert
                  </span>
                  <span>Why This Matters</span>
                </div>
                <div className="text-[11px] leading-relaxed text-[var(--ink-muted)]">
                  <ReactMarkdown
                    components={{
                      p: ({ ...props }) => (
                        <p className="mb-1 leading-relaxed" {...props} />
                      ),
                      strong: ({ ...props }) => (
                        <strong
                          className="font-semibold text-[var(--ink)]"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {explanationSections.whyThisMatters}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3 rounded-xl border border-slate-200/80 bg-slate-50 p-5 shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-1 font-[family-name:var(--font-display)] text-xs font-bold text-slate-900">
              <span className="material-symbols-outlined text-base text-sky-700">
                visibility
              </span>
              <span>What the Images Show</span>
            </div>
            <div className="flex-grow space-y-3 pt-1 text-xs">
              {explanationSections.whatImagesShow.length > 0 ? (
                explanationSections.whatImagesShow.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal)]" />
                    <div className="text-[11px] leading-relaxed text-[var(--ink-muted)]">
                      <ReactMarkdown
                        components={{
                          p: ({ ...props }) => (
                            <p className="inline" {...props} />
                          ),
                          strong: ({ ...props }) => (
                            <strong
                              className="font-semibold text-[var(--ink)]"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {point}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] leading-relaxed text-[var(--ink-muted)]">
                  Visual attention analysis details are currently processing.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-3 rounded-xl border border-sky-100 bg-sky-50/80 p-5 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-[family-name:var(--font-display)] text-xs font-bold text-sky-950">
                <span className="material-symbols-outlined text-base text-sky-700">
                  clinical_notes
                </span>
                <span>Recommended Next Step</span>
              </div>
              <div className="text-xs leading-relaxed text-sky-900">
                <ReactMarkdown
                  components={{
                    p: ({ ...props }) => (
                      <p className="mb-2 leading-relaxed" {...props} />
                    ),
                    strong: ({ ...props }) => (
                      <strong
                        className="font-semibold text-sky-950"
                        {...props}
                      />
                    ),
                  }}
                >
                  {explanationSections.recommendedNextStep ||
                    "Consult a certified healthcare provider or dermatologist for in-person evaluation."}
                </ReactMarkdown>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-sky-200/60 pt-3">
              <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-xs text-sky-700">
                  shield
                </span>
                <p className="leading-relaxed">
                  <strong>This is not a medical diagnosis.</strong> {disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-4 shadow-[var(--shadow-card)] sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
          <span
            className="material-symbols-outlined text-base text-[var(--teal)]"
            aria-hidden
          >
            biotech
          </span>
          <span>EfficientNetB3 · Grad-CAM · Gemini API</span>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto sm:justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 text-xs font-semibold text-[var(--ink)] transition-all hover:bg-[var(--surface)] sm:flex-none"
          >
            <span
              className="material-symbols-outlined text-base text-[var(--ink-muted)]"
              aria-hidden
            >
              refresh
            </span>
            Analyze Another Sample
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--teal)] px-5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--teal-deep)] sm:flex-none"
          >
            <span className="material-symbols-outlined text-base" aria-hidden>
              picture_as_pdf
            </span>
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
