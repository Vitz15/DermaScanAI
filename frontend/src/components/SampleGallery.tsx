"use client";

export interface SampleItem {
  id: string;
  path: string;
  label: string;
  sublabel: string;
  chip: string;
  chipColor: string;
}

export const SAMPLES: SampleItem[] = [
  {
    id: "melanoma",
    path: "/samples/melanoma.png",
    label: "Melanoma",
    sublabel: "Malignant",
    chip: "MEL",
    chipColor: "bg-rose-600/90",
  },
  {
    id: "nevi",
    path: "/samples/nevus.png",
    label: "Melanocytic Nevi",
    sublabel: "Benign",
    chip: "NV",
    chipColor: "bg-emerald-600/90",
  },
  {
    id: "keratosis",
    path: "/samples/keratosis.png",
    label: "Benign Keratosis",
    sublabel: "Benign",
    chip: "BKL",
    chipColor: "bg-sky-600/90",
  },
  {
    id: "bcc",
    path: "/samples/bcc.png",
    label: "Basal Cell Carcinoma",
    sublabel: "Malignant",
    chip: "BCC",
    chipColor: "bg-rose-600/90",
  },
];

interface SampleGalleryProps {
  selectedId: string | null;
  onSelect: (sample: SampleItem) => void;
}

export default function SampleGallery({
  selectedId,
  onSelect,
}: SampleGalleryProps) {
  return (
    <div className="border-t border-[var(--border)] bg-[var(--surface)]/50 p-6 sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
          Or use a verified sample:
        </span>
        <span className="rounded bg-[var(--teal-soft)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--teal)]">
          {SAMPLES.length} Samples Available
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SAMPLES.map((sample) => {
          const isSelected = sample.id === selectedId;

          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelect(sample)}
              className={[
                "group flex flex-col items-start rounded-xl p-2.5 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]",
                isSelected
                  ? "border-2 border-[var(--teal)] bg-[var(--card)]"
                  : "border border-[var(--border)] bg-[var(--card)] hover:border-[var(--border-strong)]",
              ].join(" ")}
            >
              <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-lg bg-[var(--surface)]">
                <img
                  src={sample.path}
                  alt={sample.label}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  className={`absolute right-1.5 top-1.5 rounded px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-semibold text-white ${sample.chipColor}`}
                >
                  {sample.chip}
                </span>
              </div>

              <div className="w-full truncate font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--ink)]">
                {sample.label}
              </div>
              <div className="w-full truncate text-[11px] text-[var(--ink-muted)]">
                {sample.sublabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
