"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ORDER_STATUS_STEPS, normalizeMobile, statusStepIndex } from "@/lib/orders";

type TrackResult = {
  id: string;
  status: string;
  statusLabel: string;
  date: string;
  product: string;
  amount: string;
  paymentStatus: string;
  paymentMethod: string;
  customerName: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  carrier?: string;
  awb?: string;
  trackingUrl?: string;
};

const fieldClass =
  "w-full rounded-2xl border border-[#29425e]/10 bg-[#FAFBFC] px-4 py-3.5 text-sm text-[#0c1622] outline-none transition-all placeholder:text-gray-400 focus:border-[#395c80] focus:bg-white focus:ring-2 focus:ring-[#395c80]/15";

const GUIDANCE = [
  {
    step: "01",
    title: "Find your Order ID",
    body: "Check the confirmation SMS, WhatsApp, or email you received after checkout. It looks like ORD-0001.",
  },
  {
    step: "02",
    title: "Use checkout mobile",
    body: "Enter the same 10-digit mobile number you used while placing the order.",
  },
  {
    step: "03",
    title: "See live status",
    body: "Tap Track order — the card flips to show payment, shipping, and delivery progress.",
  },
];

function trackCacheKey(orderId: string, mobile: string) {
  return `sda-track:${orderId.trim().toUpperCase()}:${normalizeMobile(mobile)}`;
}

function readTrackCache(orderId: string, mobile: string): TrackResult | null {
  try {
    const raw = sessionStorage.getItem(trackCacheKey(orderId, mobile));
    if (!raw) return null;
    return JSON.parse(raw) as TrackResult;
  } catch {
    return null;
  }
}

function writeTrackCache(orderId: string, mobile: string, data: TrackResult) {
  try {
    sessionStorage.setItem(trackCacheKey(orderId, mobile), JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [flipped, setFlipped] = useState(false);
  const autoTrackedKey = useRef("");

  const activeStep = useMemo(
    () => statusStepIndex(result?.status),
    [result?.status]
  );

  const fetchTrack = useCallback(async (id: string, mob: string) => {
    const params = new URLSearchParams({
      orderId: id.trim(),
      mobile: mob.trim(),
    });
    const res = await fetch(`/api/orders/track?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Unable to track order");
    return data as TrackResult;
  }, []);

  const trackOrder = useCallback(
    async (id: string, mob: string) => {
      const order = id.trim();
      const phone = mob.trim();
      if (!order || !phone) return;

      setError("");

      const cached = readTrackCache(order, phone);
      if (cached) {
        setResult(cached);
        setFlipped(true);
        setIsLoading(false);
        void (async () => {
          try {
            const fresh = await fetchTrack(order, phone);
            setResult(fresh);
            writeTrackCache(order, phone, fresh);
          } catch {
            /* keep cached */
          }
        })();
        return;
      }

      // Flip immediately to loading face — feels instant
      setResult(null);
      setFlipped(true);
      setIsLoading(true);

      try {
        const data = await fetchTrack(order, phone);
        setResult(data);
        writeTrackCache(order, phone, data);
      } catch (err) {
        setResult(null);
        setFlipped(false);
        setError(err instanceof Error ? err.message : "Unable to track order");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTrack]
  );

  useEffect(() => {
    const presetOrder = searchParams.get("order") || "";
    const presetMobile = searchParams.get("mobile") || "";
    if (presetOrder) setOrderId(presetOrder);
    if (presetMobile) setMobile(presetMobile);

    if (presetOrder && presetMobile) {
      const key = `${presetOrder}|${presetMobile}`;
      if (autoTrackedKey.current === key) return;
      autoTrackedKey.current = key;
      void trackOrder(presetOrder, presetMobile);
    }
  }, [searchParams, trackOrder]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    void trackOrder(orderId, mobile);
  };

  const handleSearchAgain = () => {
    setFlipped(false);
    setError("");
    setIsLoading(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F8FA]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-[420px] w-[520px] rounded-full bg-[#395c80]/8 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[280px] translate-x-1/4 translate-y-1/4 rounded-full bg-[#29425e]/6 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1920px] px-5 pb-28 max-[1020px]:pb-32 pt-[100px] sm:px-8 md:pt-[140px] xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left — guidance */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] px-5 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-md animate-shimmer">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Order tracking
            </div>

            <h1 className="font-malayalam-display text-3xl font-bold leading-[1.4] text-[#0c1622] sm:text-4xl xl:text-5xl overflow-visible py-1">
              How to{" "}
              <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer">
                track
              </span>{" "}
              your order
            </h1>

            <p className="mt-4 max-w-lg text-base leading-[1.8] text-gray-500 font-malayalam sm:text-lg">
              നിങ്ങളുടെ Order ID-യും ചെക്കൗട്ടിൽ ഉപയോഗിച്ച മൊബൈൽ നമ്പറും നൽകി ഓർഡർ സ്റ്റാറ്റസ് അറിയാം.
            </p>

            <div className="mt-8 w-full max-w-lg space-y-5">
              {GUIDANCE.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0c1622] text-[11px] font-black tracking-wider text-white">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0c1622] sm:text-base">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#29425e]/10 bg-white/70 px-5 py-4 text-sm text-gray-500 backdrop-blur-sm">
              <span className="font-semibold text-[#29425e]">Tip:</span> Order ID is case-insensitive.
              Mobile must match the number used at checkout.
            </div>
          </div>

          {/* Right — flip card (search ↔ details) */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full" style={{ perspective: "1400px" }}>
              <div
                className="relative w-full transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* FRONT — search */}
                <div
                  className={`w-full rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8 ${
                    flipped ? "invisible absolute inset-x-0 top-0" : "relative"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#395c80]">
                      Search order
                    </p>
                    <h2 className="mt-2 font-malayalam-display text-2xl font-bold text-[#0c1622] sm:text-3xl">
                      Enter your details
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      We&apos;ll flip this card to reveal your live order status.
                    </p>
                  </div>

                  <form onSubmit={handleTrack} className="flex flex-col space-y-5">
                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#395c80]/80">
                        Order ID
                      </label>
                      <input
                        required
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="ORD-0001"
                        className={fieldClass}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#395c80]/80">
                        Mobile number
                      </label>
                      <input
                        required
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="10-digit mobile"
                        className={fieldClass}
                        disabled={isLoading}
                      />
                    </div>

                    {error && (
                      <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(41,66,94,0.28)] transition-all hover:brightness-110 disabled:opacity-70"
                    >
                      Track order
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden
                      >
                        <path d="M5 12h14" strokeLinecap="round" />
                        <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </form>
                </div>

                {/* BACK — details */}
                <div
                  className={`w-full overflow-visible rounded-[28px] border border-white/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] ${
                    flipped ? "relative" : "invisible absolute inset-x-0 top-0"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {result ? (
                    <>
                      <div className="flex items-start justify-between gap-3 bg-[linear-gradient(135deg,#0c1622_0%,#29425e_100%)] px-6 py-5 text-white sm:px-8">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                            Order found
                          </p>
                          <p className="mt-1 truncate font-malayalam-display text-xl font-bold sm:text-2xl">
                            {result.id}
                          </p>
                          <p className="mt-1 text-sm text-white/60">{result.date || "—"}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ring-white/20">
                          {result.statusLabel}
                        </span>
                      </div>

                      <div className="flex flex-col p-5 sm:p-6">
                        <div className="space-y-0">
                          {ORDER_STATUS_STEPS.map((step, idx) => {
                            const done = idx <= activeStep;
                            const current = idx === activeStep;
                            const isLast = idx === ORDER_STATUS_STEPS.length - 1;
                            return (
                              <div key={step} className="relative flex gap-3 pb-5 last:pb-0">
                                {!isLast && (
                                  <span
                                    className={`absolute left-[13px] top-7 h-[calc(100%-1rem)] w-px ${
                                      idx < activeStep ? "bg-[#29425e]" : "bg-gray-200"
                                    }`}
                                    aria-hidden
                                  />
                                )}
                                <div
                                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                    done
                                      ? "bg-[#0c1622] text-white"
                                      : "bg-gray-100 text-gray-400"
                                  } ${current ? "ring-4 ring-[#395c80]/20" : ""}`}
                                >
                                  {done ? "✓" : idx + 1}
                                </div>
                                <div className="min-w-0 pt-0.5">
                                  <p className={`text-sm font-semibold ${done ? "text-[#0c1622]" : "text-gray-400"}`}>
                                    {step}
                                  </p>
                                  {current && (
                                    <p className="text-[11px] font-medium text-[#395c80]">Current status</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-6 space-y-2.5 border-t border-[#29425e]/8 pt-5 text-sm">
                          {result.customerName && (
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">Customer</span>
                              <span className="font-semibold text-[#0c1622]">{result.customerName}</span>
                            </div>
                          )}
                          {result.product && (
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">Product</span>
                              <span className="max-w-[55%] text-right font-semibold text-[#0c1622]">
                                {result.product}
                              </span>
                            </div>
                          )}
                          {result.amount && (
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">Amount</span>
                              <span className="font-semibold text-[#0c1622]">{result.amount}</span>
                            </div>
                          )}
                          {result.paymentStatus && (
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">Payment</span>
                              <span className="font-semibold text-[#0c1622]">{result.paymentStatus}</span>
                            </div>
                          )}
                          {(result.shippingCity || result.shippingPincode) && (
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">Ship to</span>
                              <span className="max-w-[55%] text-right font-semibold text-[#0c1622]">
                                {[result.shippingCity, result.shippingState, result.shippingPincode]
                                  .filter(Boolean)
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                          {(result.awb || result.carrier) && (
                            <div className="flex justify-between gap-3 text-sm">
                              <span className="text-gray-400">Shipment</span>
                              <span className="max-w-[55%] text-right font-semibold text-[#0c1622]">
                                {[result.carrier, result.awb].filter(Boolean).join(" · ")}
                                {result.trackingUrl ? (
                                  <>
                                    <br />
                                    <a
                                      href={result.trackingUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs font-medium text-[#29425e] underline"
                                    >
                                      Open courier tracking
                                    </a>
                                  </>
                                ) : null}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleSearchAgain}
                          className="mt-5 w-full rounded-full border border-[#29425e]/15 py-3 text-sm font-bold text-[#0c1622] transition-colors hover:bg-[#F4F7FA]"
                        >
                          Search another order
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center">
                      <div className="h-10 w-10 rounded-full border-2 border-[#395c80]/25 border-t-[#29425e] animate-spin" />
                      <div>
                        <p className="text-sm font-bold text-[#0c1622]">Looking up your order…</p>
                        <p className="mt-1 text-xs text-gray-500">This usually takes a moment</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <React.Suspense
        fallback={
          <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] pt-[140px] text-gray-500">
            Loading...
          </main>
        }
      >
        <TrackOrderContent />
      </React.Suspense>
      <Footer />
    </>
  );
}
