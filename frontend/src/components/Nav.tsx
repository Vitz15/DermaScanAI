"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "./AuthModal";
interface NavProps {
  hasResult?: boolean;
  onGoToWorkspace?: () => void;
}

export default function Nav({ hasResult = false, onGoToWorkspace }: NavProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
  }, [authOpen]);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    window.location.reload();
  };
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)]/80 bg-[var(--bg)]/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo/Logo.png"
                alt="DermaScanAI Logo"
                width={25}
                height={25}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-[var(--ink)]">
                DermaScan
                <span className="font-semibold text-[var(--teal)]">AI</span>
              </span>
              <span className="rounded border border-[var(--teal)]/20 bg-[var(--teal-soft)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[var(--teal)]">
                Research
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 font-[family-name:var(--font-display)] text-sm font-medium text-[var(--ink-muted)] md:flex">
            {hasResult ? (
              <button
                type="button"
                onClick={onGoToWorkspace}
                className="transition-colors hover:text-[var(--teal)]"
              >
                Demo Workspace
              </button>
            ) : (
              <a href="#demo" className="font-semibold text-[var(--teal)]">
                Demo Workspace
              </a>
            )}

            <span
              className={
                hasResult
                  ? "font-semibold text-[var(--teal)]"
                  : "cursor-default text-[var(--ink-muted)]/60"
              }
            >
              Analysis Results
            </span>

            <a
              href="https://github.com/Vitz15/DermaScanAI"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-[var(--teal)]"
            >
              GitHub
              <span
                className="material-symbols-outlined text-[13px] opacity-70"
                aria-hidden
              >
                arrow_outward
              </span>
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--ink-muted)] transition-all duration-200 hover:bg-[var(--surface-subtle)] hover:text-[var(--teal)]"
              >
                <span
                  className="material-symbols-outlined text-base"
                  aria-hidden
                >
                  logout
                </span>
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--ink-muted)] transition-all duration-200 hover:bg-[var(--surface-subtle)] hover:text-[var(--teal)]"
              >
                <span
                  className="material-symbols-outlined text-base"
                  aria-hidden
                >
                  login
                </span>
                <span>Sign In</span>
              </button>
            )}
            {hasResult ? (
              <button
                type="button"
                onClick={onGoToWorkspace}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--teal)] px-4 py-2 font-[family-name:var(--font-display)] text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--teal-deep)]"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden>
                  add_a_photo
                </span>
                New Analysis
              </button>
            ) : (
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--teal)] px-4 py-2 font-[family-name:var(--font-display)] text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--teal-deep)]"
              >
                Start Analysis
                <span className="material-symbols-outlined text-sm" aria-hidden>
                  arrow_forward
                </span>
              </a>
            )}
          </div>
        </div>
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
