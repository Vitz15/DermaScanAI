"use client";

import { useCallback, useRef, useState } from "react";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  errorMessage: string | null;
  sampleReady?: boolean;
  onRunSample?: () => void;
  requireAuth?: () => boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_MB = 10;

export default function UploadDropzone({
  onFileSelected,
  isLoading,
  errorMessage,
  sampleReady = false,
  onRunSample,
  requireAuth,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndEmit = useCallback(
    (file: File) => {
      setLocalError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setLocalError("Unsupported format. Use JPG or PNG.");
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`File size exceeds ${MAX_SIZE_MB}MB.`);
        return;
      }

      onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (requireAuth && !requireAuth()) return;

    const file = e.dataTransfer.files?.[0];

    if (file) {
      validateAndEmit(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      validateAndEmit(file);
    }

    e.target.value = "";
  };

  const displayError = errorMessage || localError;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!isLoading) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={!isLoading ? handleDrop : undefined}
      className={[
        "p-8 text-center transition-colors sm:p-12",
        isDragging ? "bg-[var(--teal-soft)]/60" : "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleChange}
        disabled={isLoading}
      />

      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--teal-soft)] text-[var(--teal)] transition-transform duration-200 hover:scale-105">
          {isLoading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--teal)] motion-reduce:animate-none" />
          ) : (
            <span className="material-symbols-outlined text-2xl" aria-hidden>
              add_photo_alternate
            </span>
          )}
        </div>

        <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--ink)]">
          {isLoading ? "Analyzing image..." : "Upload Dermoscopic Image"}
        </h2>

        <p className="mb-6 text-sm leading-relaxed text-[var(--ink-muted)]">
          {isLoading
            ? "The model is processing the image. Please wait a few seconds."
            : "Drag & drop a high-resolution skin lesion image, or click the button below to select a file from your device."}
        </p>

        {!isLoading && (
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (requireAuth && !requireAuth()) return;
                inputRef.current?.click();
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--teal-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)] sm:w-auto"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden>
                upload
              </span>
              Choose Image
            </button>

            <button
              type="button"
              disabled={!sampleReady}
              onClick={() => {
                if (requireAuth && !requireAuth()) return;
                onRunSample?.();
              }}
              className={[
                "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-6 py-2.5 text-sm font-semibold shadow-[var(--shadow-soft)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)] sm:w-auto",
                sampleReady
                  ? "border-[var(--border)] bg-[var(--teal-soft)] text-[var(--teal)] hover:bg-[var(--teal-soft)]/70"
                  : "cursor-not-allowed border-[var(--border)] bg-[var(--card)] text-[var(--ink-muted)]",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-base" aria-hidden>
                auto_fix_high
              </span>
              Run Active Sample
            </button>
          </div>
        )}

        {!isLoading && (
          <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink-muted)]">
            JPG, PNG up to {MAX_SIZE_MB}MB · Recommended min. 450×600 px
          </p>
        )}
      </div>

      {displayError && (
        <div
          role="alert"
          className="mx-auto mt-4 flex max-w-md items-start gap-3 rounded-xl border border-[var(--coral)]/15 bg-[var(--coral-soft)] px-4 py-3 text-left text-sm text-[var(--coral)]"
        >
          <span className="mt-0.5 shrink-0">!</span>
          <p>{displayError}</p>
        </div>
      )}
    </div>
  );
}
