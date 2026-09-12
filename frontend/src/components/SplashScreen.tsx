"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [skippable, setSkippable] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("dermascan_intro_seen");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (alreadySeen || prefersReduced) {
      setVisible(false);
      return;
    }

    const skipTimer = setTimeout(() => setSkippable(true), 300);
    const exitTimer = setTimeout(() => setExiting(true), 1700);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("dermascan_intro_seen", "1");
    }, 2200);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleSkip = () => {
    if (!skippable || exiting) return;
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("dermascan_intro_seen", "1");
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      role="presentation"
      onClick={handleSkip}
      className={
        "fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[var(--teal-deep)] transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] " +
        (exiting ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100")
      }
    >
      <div className="flex items-center gap-3">
        <svg
          className="splash-ring-in"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" stroke="#F2C879" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="4.5" stroke="#F2C879" strokeWidth="1.4" />
          <line
            x1="12"
            y1="1.5"
            x2="12"
            y2="5"
            stroke="#F2C879"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="19"
            x2="12"
            y2="22.5"
            stroke="#F2C879"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative inline-block overflow-hidden">
          <span className="splash-wordmark-reveal font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            DermaScanAI
          </span>
          <span className="splash-scan-bar" aria-hidden></span>
        </div>
      </div>

      <span className="sr-only">Memuat DermaScan AI</span>
    </div>
  );
}
