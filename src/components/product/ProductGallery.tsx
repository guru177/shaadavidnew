"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { isVideoUrl } from "@/lib/media";
import { parseYouTubeId, youtubeEmbedUrl, youtubeThumb } from "@/lib/youtube";

const Globe3D = dynamic(() => import("@/components/Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 rounded-full border-2 border-[#395c80]/30 border-t-[#395c80] animate-spin" />
    </div>
  ),
});

type Props = {
  images: string[];
  title: string;
};

function MediaThumb({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const fitClass = `w-full h-full object-cover ${className || ""}`.trim();
  const ytId = parseYouTubeId(src);
  if (ytId) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={youtubeThumb(ytId)} className={fitClass} alt={alt} loading="lazy" />;
  }
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        className={fitClass}
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} className={fitClass} alt={alt} loading="lazy" />;
}

function ProductShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getUrl = () => (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShareClick = async () => {
    const url = getUrl();
    const shareData = {
      title,
      text: title,
      url,
    };
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    setOpen((v) => !v);
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${getUrl()}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="absolute top-4 right-4 z-20">
      <button
        type="button"
        onClick={handleShareClick}
        aria-label="Share product"
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#395c80] transition-colors"
      >
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-48 rounded-2xl border border-[#29425e]/10 bg-white shadow-[0_16px_40px_rgba(12,22,34,0.14)] overflow-hidden py-1">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="w-full px-3.5 py-2.5 text-left text-sm font-medium text-[#0c1622] hover:bg-[#F4F7FA] flex items-center gap-2.5"
          >
            <span className="w-7 h-7 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.026c0 2.12.554 4.189 1.602 6.006L0 24l6.135-1.61a11.803 11.803 0 005.911 1.586h.005c6.634 0 12.032-5.396 12.034-12.028a11.794 11.794 0 00-3.417-8.467z" />
              </svg>
            </span>
            WhatsApp
          </button>
          <button
            type="button"
            onClick={shareFacebook}
            className="w-full px-3.5 py-2.5 text-left text-sm font-medium text-[#0c1622] hover:bg-[#F4F7FA] flex items-center gap-2.5"
          >
            <span className="w-7 h-7 rounded-full bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </span>
            Facebook
          </button>
          <button
            type="button"
            onClick={async () => {
              await copyLink();
            }}
            className="w-full px-3.5 py-2.5 text-left text-sm font-medium text-[#0c1622] hover:bg-[#F4F7FA] flex items-center gap-2.5"
          >
            <span className="w-7 h-7 rounded-full bg-[#395c80]/10 text-[#395c80] flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {copied ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                ) : (
                  <>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </>
                )}
              </svg>
            </span>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductGallery({ images, title }: Props) {
  const [activeTab, setActiveTab] = useState<number | "3d">(1);
  const [soundUnlocked, setSoundUnlocked] = useState(false);
  const fileVideoRef = useRef<HTMLVideoElement | null>(null);
  const safeImages = images?.length ? images : ["/product.webp"];
  const activeSrc = activeTab === "3d" ? null : safeImages[(activeTab as number) - 1];
  const activeYtId = activeSrc ? parseYouTubeId(activeSrc) : null;
  const activeIsVideo = activeSrc ? isVideoUrl(activeSrc) : false;
  // Autoplay only when the first gallery item is a video and still selected
  const shouldAutoplay = activeTab === 1 && isVideoUrl(safeImages[0]);

  // Browsers often block sound until a gesture — unlock on first tap/key anywhere
  useEffect(() => {
    if (!shouldAutoplay || soundUnlocked) return;
    const unlock = () => {
      setSoundUnlocked(true);
      const el = fileVideoRef.current;
      if (el) {
        el.muted = false;
        el.volume = 1;
        void el.play().catch(() => {});
      }
    };
    document.addEventListener("pointerdown", unlock, { capture: true, once: true });
    document.addEventListener("keydown", unlock, { capture: true, once: true });
    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
    };
  }, [shouldAutoplay, soundUnlocked]);

  useEffect(() => {
    if (!shouldAutoplay) setSoundUnlocked(false);
  }, [shouldAutoplay]);

  return (
    <div className="lg:sticky top-20 flex flex-col gap-3 sm:gap-4">
      <div className="w-full aspect-square border border-gray-100 rounded-none sm:rounded-3xl relative bg-gray-50">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {activeTab === "3d" ? (
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <Globe3D />
            </div>
          ) : activeYtId ? (
            <iframe
              key={`${activeYtId}-${shouldAutoplay ? "ap" : "idle"}-${soundUnlocked ? "snd" : "m"}`}
              src={youtubeEmbedUrl(activeYtId, {
                autoplay: shouldAutoplay,
                // Start muted so autoplay works; remount unmuted after first tap
                mute: shouldAutoplay && !soundUnlocked,
              })}
              title={title}
              className="w-full h-full border-0 bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : activeIsVideo && activeSrc ? (
            <video
              key={activeSrc}
              ref={(el) => {
                fileVideoRef.current = el;
                if (!el || !shouldAutoplay) return;
                const start = () => {
                  el.volume = 1;
                  if (soundUnlocked) {
                    el.muted = false;
                    void el.play().catch(() => {});
                    return;
                  }
                  // Autoplay first (muted), then try sound; browsers usually allow unmute after play
                  el.muted = true;
                  const p = el.play();
                  if (p && typeof p.then === "function") {
                    p.then(() => {
                      el.muted = false;
                      void el.play().catch(() => {
                        el.muted = true;
                        void el.play();
                      });
                    }).catch(() => {});
                  }
                };
                if (el.readyState >= 2) start();
                else el.addEventListener("loadeddata", start, { once: true });
              }}
              src={activeSrc}
              className="w-full h-full object-contain bg-black"
              controls
              playsInline
              muted={!soundUnlocked}
              autoPlay={shouldAutoplay}
              loop={shouldAutoplay}
              preload="auto"
              aria-label={title}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeSrc || safeImages[0]}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              alt={title}
              fetchPriority="high"
            />
          )}
        </div>

        <ProductShareButton title={title} />
      </div>

      <div className="flex gap-2 md:gap-3 w-full pb-1 overflow-x-auto overscroll-x-contain snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
        {safeImages.map((img, i) => {
          const tabIndex = i + 1;
          const video = isVideoUrl(img);
          return (
            <div
              key={`${img}-${tabIndex}`}
              onClick={() => setActiveTab(tabIndex)}
              className={`w-16 sm:w-20 md:w-24 shrink-0 snap-start aspect-square border ${activeTab === tabIndex ? "border-[#395c80] border-2" : "border-gray-200"} rounded-xl p-1 cursor-pointer hover:border-[#395c80] hover:border-2 transition-all relative overflow-hidden bg-gray-50`}
            >
              <MediaThumb src={img} alt={`${title} thumbnail ${tabIndex}`} className="rounded-lg" />
              {video && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              )}
            </div>
          );
        })}

        <div
          onClick={() => setActiveTab("3d")}
          className={`w-16 sm:w-20 md:w-24 shrink-0 snap-start aspect-square border ${activeTab === "3d" ? "border-[#395c80] border-2" : "border-gray-200"} rounded-xl p-1.5 md:p-2.5 cursor-pointer hover:border-[#395c80] hover:border-2 transition-all relative flex items-center justify-center overflow-hidden bg-gray-50`}
        >
          <MediaThumb
            src={safeImages.find((s) => !isVideoUrl(s)) || safeImages[0]}
            alt="360 Render"
            className="rounded-lg opacity-40 grayscale"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
            <svg className="w-8 h-8 text-[#395c80] drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span className="text-[10px] md:text-xs font-bold text-[#395c80] mt-1 bg-white/80 px-2 py-0.5 rounded-full shadow-sm">360°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
