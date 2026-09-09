"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { adminShimmer } from "@/components/admin/adminStyles";

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c1622] font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#395c80]/25 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#29425e]/35 blur-[150px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white mb-8 transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Website
        </Link>

        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[28px] p-8 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="mb-10 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6 overflow-hidden rounded-full ring-2 ring-white/20 shadow-[0_12px_30px_rgba(41,66,94,0.4)]">
              <Image src="/logo.png" alt="Shaa David" fill className="object-cover" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8aa0b8] mb-2">
              Shaa David&apos;s Academy
            </p>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2 font-malayalam-display">
              Admin Portal
            </h1>
            <p className="text-white/50 text-sm">Sign in to manage the store and content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-sm font-medium text-center">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#8aa0b8] transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-black/25 border border-white/10 rounded-2xl focus:bg-black/40 focus:border-[#395c80]/60 focus:ring-1 focus:ring-[#395c80]/40 transition-all outline-none text-white text-sm placeholder-white/25"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1 mr-1">
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert("Please contact the system administrator to reset your password.")
                    }
                    className="text-xs text-[#8aa0b8] hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#8aa0b8] transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 bg-black/25 border border-white/10 rounded-2xl focus:bg-black/40 focus:border-[#395c80]/60 focus:ring-1 focus:ring-[#395c80]/40 transition-all outline-none text-white text-sm placeholder-white/25 tracking-widest"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors focus:outline-none"
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`relative w-full mt-6 py-4 ${adminShimmer} text-white rounded-full font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden shadow-[0_12px_32px_rgba(41,66,94,0.45)] hover:brightness-110`}
            >
              <span className="relative z-10 flex items-center gap-2">
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
                    Authenticating...
                  </>
                ) : (
                  "Secure Login"
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
