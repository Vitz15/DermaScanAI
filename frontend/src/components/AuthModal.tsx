"use client";

import { useEffect, useState } from "react";

interface AuthModalProps {
  onClose: () => void;
}

type AuthMode = "login" | "register";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Close the modal with the Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Prevent background page scrolling while the modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const resetFormState = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    resetFormState();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (mode === "register" && password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
            confirm_password: confirmPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.detail?.message ?? "Registration failed.");
          return;
        }

        // Registration succeeded, but there's no token yet.
        // Move the user to the login tab so they can sign in.
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setError(null);
      } else {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.detail?.message ?? "Incorrect email or password.");
          return;
        }

        localStorage.setItem("access_token", data.access_token);
        onClose();
        window.location.reload(); // simplest way to refresh Nav's auth state
      }
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex animate-auth-overlay items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="relative w-full max-w-md animate-auth-modal overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pb-4 pt-6 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--teal-soft)] text-[var(--teal)]">
                <span className="material-symbols-outlined text-xl" aria-hidden>
                  lock
                </span>
              </div>

              <div>
                <h2
                  id="auth-modal-title"
                  className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--ink)]"
                >
                  {mode === "login"
                    ? "Sign In to DermaScan"
                    : "Create Your DermaScan Account"}
                </h2>

                <p className="mt-1 font-[family-name:var(--font-display)] text-xs leading-5 text-[var(--ink-muted)]">
                  Access the HAM10000 Research Portal
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-xl" aria-hidden>
                close
              </span>
            </button>
          </div>
        </div>

        {/* Authentication Tabs */}
        <div className="px-6 sm:px-7">
          <div className="flex rounded-lg bg-[var(--surface-subtle)] p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-md px-3 py-2 font-[family-name:var(--font-display)] text-xs font-semibold transition-all ${
                mode === "login"
                  ? "bg-[var(--surface)] text-[var(--teal)] shadow-sm"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 rounded-md px-3 py-2 font-[family-name:var(--font-display)] text-xs font-semibold transition-all ${
                mode === "register"
                  ? "bg-[var(--surface)] text-[var(--teal)] shadow-sm"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-5 sm:px-7">
          {/* Full Name - Sign Up only */}
          {mode === "register" && (
            <div className="mb-4">
              <label
                htmlFor="auth-name"
                className="mb-1.5 block font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--ink)]"
              >
                Full Name
              </label>

              <div className="relative">
                <span
                  className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--ink-muted)]"
                  aria-hidden
                >
                  person
                </span>

                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] pl-10 pr-3 font-[family-name:var(--font-display)] text-sm text-[var(--ink)] outline-none transition-all placeholder:text-[var(--ink-muted)]/60 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="auth-email"
              className="mb-1.5 block font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--ink)]"
            >
              Email
            </label>

            <div className="relative">
              <span
                className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--ink-muted)]"
                aria-hidden
              >
                mail
              </span>

              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] pl-10 pr-3 font-[family-name:var(--font-display)] text-sm text-[var(--ink)] outline-none transition-all placeholder:text-[var(--ink-muted)]/60 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="auth-password"
              className="mb-1.5 block font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--ink)]"
            >
              Password
            </label>

            <div className="relative">
              <span
                className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--ink-muted)]"
                aria-hidden
              >
                lock
              </span>

              <input
                id="auth-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                placeholder="••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] pl-10 pr-11 font-[family-name:var(--font-display)] text-sm text-[var(--ink)] outline-none transition-all placeholder:text-[var(--ink-muted)]/60 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--ink-muted)] transition-colors hover:text-[var(--teal)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password - Sign Up only */}
          {mode === "register" && (
            <div className="mb-4">
              <label
                htmlFor="auth-confirm-password"
                className="mb-1.5 block font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--ink)]"
              >
                Confirm Password
              </label>

              <div className="relative">
                <span
                  className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--ink-muted)]"
                  aria-hidden
                >
                  lock
                </span>

                <input
                  id="auth-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] pl-10 pr-11 font-[family-name:var(--font-display)] text-sm text-[var(--ink)] outline-none transition-all placeholder:text-[var(--ink-muted)]/60 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
                />

                {/* Show / Hide Confirm Password */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--ink-muted)] transition-colors hover:text-[var(--teal)]"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden
                  >
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Remember Me / Forgot Password */}
          {mode === "login" && (
            <div className="mb-5 flex items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-3.5 w-3.5 rounded border-[var(--border)] accent-[var(--teal)]"
                />

                <span className="font-[family-name:var(--font-display)] text-[11px] text-[var(--ink-muted)]">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => {
                  console.log("Forgot password");
                }}
                className="font-[family-name:var(--font-display)] text-[11px] font-semibold text-[var(--teal)] transition-colors hover:text-[var(--teal-deep)]"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="mb-4 font-[family-name:var(--font-display)] text-[11px] font-medium text-red-500">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-4 font-[family-name:var(--font-display)] text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--teal-deep)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base" aria-hidden>
              {mode === "login" ? "login" : "person_add"}
            </span>

            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>

          {/* Switch Authentication Mode */}
          <div className="mt-5 text-center">
            <span className="font-[family-name:var(--font-display)] text-[11px] text-[var(--ink-muted)]">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
              className="font-[family-name:var(--font-display)] text-[11px] font-semibold text-[var(--teal)] transition-colors hover:text-[var(--teal-deep)]"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
