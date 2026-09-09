"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Globe3D from "@/components/Globe3D";
import {
  adminBtnPrimary,
  adminLabel,
  adminPillBadge,
  adminShimmer,
} from "@/components/admin/adminStyles";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAuthError(data.error || "Invalid username or password.");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next") || "/admin";
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setAuthError("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return <div className="h-dvh w-full bg-[#F7F9FB]" />;
  }

  return (
    <div className="h-dvh w-full max-h-dvh overflow-hidden bg-white font-sans grid lg:grid-cols-2">
      {/* Left — full-height brand + 3D book */}
      <div className="relative hidden lg:flex h-dvh flex-col overflow-hidden bg-[linear-gradient(145deg,#0c1622_0%,#29425e_52%,#395c80_100%)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute top-[-18%] right-[-12%] h-[55%] w-[55%] rounded-full bg-white/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-20%] left-[-18%] h-[50%] w-[50%] rounded-full bg-[#0c1622]/45 blur-[80px]" />

        <Link
          href="/"
          className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Return to website
        </Link>

        <div className="relative z-10 flex-1 flex items-center justify-center px-6 pt-14 pb-4 min-h-0">
          <div className="relative w-full h-full max-w-[520px] max-h-[520px] aspect-square">
            <Globe3D />
          </div>
        </div>

        <div className="relative z-10 px-8 xl:px-12 pb-10 pt-2 shrink-0">
          <p className="font-malayalam-display text-white text-2xl xl:text-3xl font-bold leading-[1.45] drop-shadow-md">
            ഷാ ഡേവിഡ്സ് അക്കാദമി
          </p>
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/85">
            Explore. Learn. Grow.
          </p>
        </div>
      </div>

      {/* Right — form fills remaining viewport */}
      <div className="relative h-dvh overflow-y-auto flex flex-col justify-center bg-[#F7F9FB] px-6 py-10 sm:px-10 lg:px-14 xl:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(41,66,94,0.07) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <Link
          href="/"
          className="lg:hidden absolute top-5 left-5 z-20 inline-flex items-center gap-2 text-sm font-medium text-[#395c80] hover:text-[#0c1622] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Return to website
        </Link>

        <div className="relative z-10 mx-auto w-full max-w-[400px]">
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-[#29425e]/15 shadow-[0_8px_20px_rgba(41,66,94,0.2)] shrink-0">
                <Image src="/logo.png" alt="Shaa David" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#395c80]">
                  Shaa David&apos;s Academy
                </p>
                <span className={`${adminPillBadge} mt-1.5 !mb-0 !py-1 !px-3 !text-[9px]`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                  Admin
                </span>
              </div>
            </div>

            {/* Mobile book */}
            <div className="lg:hidden mb-6 mx-auto w-[min(100%,220px)] h-[220px] rounded-2xl overflow-hidden bg-[linear-gradient(145deg,#0c1622_0%,#29425e_100%)]">
              <Globe3D />
            </div>

            <h1 className="font-malayalam-display text-[28px] sm:text-[34px] font-bold tracking-tight text-[#0c1622] leading-[1.35]">
              <span className={`text-transparent bg-clip-text ${adminShimmer}`}>
                Welcome back
              </span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Enter your username and password to access the admin portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-center">
                {authError}
              </div>
            )}

            <div>
              <label htmlFor="admin-username" className={adminLabel}>
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#29425e]/10 bg-white text-sm text-[#0c1622] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] transition-shadow"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className={`${adminLabel} !mb-0`}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Please contact the system administrator to reset your password."
                    )
                  }
                  className="text-xs font-semibold text-[#395c80] hover:text-[#0c1622] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-[#29425e]/10 bg-white text-sm text-[#0c1622] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] transition-shadow tracking-wide"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#395c80]/50 hover:text-[#29425e] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${adminBtnPrimary} w-full !py-3.5 !text-[15px] mt-2`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Authorized staff only ·{" "}
            <Link href="/" className="font-semibold text-[#395c80] hover:text-[#0c1622]">
              Visit storefront
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
