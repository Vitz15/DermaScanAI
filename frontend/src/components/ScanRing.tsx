"use client";

interface ScanRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  tone?: "teal" | "coral";
  children?: React.ReactNode;
}

export default function ScanRing({
  percentage,
  size = 160,
  strokeWidth = 8,
  tone = "teal",
  children,
}: ScanRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color =
    tone === "coral" ? "var(--coral)" : "var(--teal)";

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Tingkat keyakinan ${percentage.toFixed(0)} persen`}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 overflow-visible"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>

      <div
        className="absolute inset-[14%] rounded-full border border-[var(--border)]/60 bg-[var(--bg)]"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}