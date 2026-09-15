"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import UploadDropzone from "@/components/UploadDropzone";
import AuthModal from "@/components/AuthModal";
import SampleGallery, { SampleItem } from "@/components/SampleGallery";
import ResultPanel from "@/components/ResultPanel";
import HowItWorks from "@/components/HowItWorks";
import SplashScreen from "@/components/SplashScreen";
import { predictImage, fileToBase64 } from "@/lib/api";
import { PredictResponse } from "@/lib/types";

const CLASS_LABELS: Record<string, string> = {
  akiec: "Actinic Keratosis",
  bcc: "Basal Cell Carcinoma",
  bkl: "Benign Keratosis",
  df: "Dermatofibroma",
  mel: "Melanoma",
  nv: "Nevus",
  vasc: "Vascular Lesion",
};

function generateAnalysisId(): string {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DS-${random}`;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleItem | null>(null);
  const [analysisMeta, setAnalysisMeta] = useState<{
    id: string;
    timestamp: Date;
  } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const requireAuth = () => {
    if (!localStorage.getItem("access_token")) {
      setAuthOpen(true);
      return false;
    }
    return true;
  };
  const runPrediction = async (file: File) => {
    setError(null);
    setIsLoading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const base64 = await fileToBase64(file);
      const response = await predictImage(base64);
      setResult(response);
      setAnalysisMeta({ id: generateAnalysisId(), timestamp: new Date() });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";

      setError(message);
      setPreviewUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedSample(null);
    runPrediction(file);
  };

  const handleRunSample = async () => {
    if (!selectedSample) return;

    try {
      const res = await fetch(selectedSample.path);
      const blob = await res.blob();
      const file = new File([blob], `${selectedSample.id}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      runPrediction(file);
    } catch {
      setError(
        "Failed to load sample image. Make sure the sample file is available in /public/samples.",
      );
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setPreviewUrl(null);
    setSelectedSample(null);
    setAnalysisMeta(null);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SplashScreen />

      <Nav hasResult={!!result} onGoToWorkspace={handleReset} />
      <DisclaimerBanner compact />

      {!result ? (
        <main className="flex-1">
          <section className="mx-auto max-w-4xl px-6 pb-12 pt-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--teal-soft)] px-3 py-1 font-[family-name:var(--font-display)] text-xs font-medium">
              <span className="font-semibold text-[var(--teal)]">
                EfficientNet-B3 + Grad-CAM
              </span>
              <span className="text-[var(--border-strong)]">•</span>
              <span className="text-[var(--ink)]">
                Trained on the HAM10000 Dataset
              </span>
            </div>

            <h1 className="mb-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.12] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-[56px]">
              Skin lesion classification with{" "}
              <span className="text-[var(--teal)]">Explainable AI</span>{" "}
              transparency.
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
              Intelligent visual inference for detecting 7 types of
              dermatological lesions. Provides objective probability estimates
              accompanied by Grad-CAM activations that can be visually verified.
            </p>
          </section>

          <section id="demo" className="mx-auto max-w-4xl px-6 pb-20">
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-card)]">
              <UploadDropzone
                onFileSelected={handleFileSelected}
                isLoading={isLoading}
                errorMessage={error}
                sampleReady={!!selectedSample}
                onRunSample={handleRunSample}
                requireAuth={requireAuth}
              />

              <SampleGallery
                selectedId={selectedSample?.id ?? null}
                onSelect={setSelectedSample}
              />
            </div>
          </section>

          <section className="border-y border-[var(--border)] bg-[var(--card)] py-12">
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--teal)] sm:text-4xl">
                  —%
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
                  Top-1 Accuracy
                </div>
                <div className="mt-0.5 text-xs text-[var(--ink-muted)]">
                  HAM10000 Test Split
                </div>
              </div>

              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
                  —%
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
                  Sensitivity (Recall)
                </div>
                <div className="mt-0.5 text-xs text-[var(--ink-muted)]">
                  Specific to Melanoma Cases
                </div>
              </div>

              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
                  10.015
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
                  Training Images
                </div>
                <div className="mt-0.5 text-xs text-[var(--ink-muted)]">
                  HAM10000 Dataset
                </div>
              </div>

              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--amber)] sm:text-4xl">
                  —
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
                  Inference Latency
                </div>
                <div className="mt-0.5 text-xs text-[var(--ink-muted)]">
                  Measured at deployment
                </div>
              </div>
            </div>
          </section>
          <HowItWorks />
        </main>
      ) : (
        <main className="flex-1 bg-[var(--bg)]">
          <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
            <ResultPanel
              result={result}
              originalImageUrl={previewUrl!}
              labels={CLASS_LABELS}
              onReset={handleReset}
              analysisId={analysisMeta?.id ?? "—"}
              timestamp={analysisMeta?.timestamp ?? new Date()}
            />
          </div>
        </main>
      )}

      <Footer />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
