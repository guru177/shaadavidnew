"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { GalleryItem } from "@/lib/youtube";
import {
  isFileGalleryVideo,
  isYouTubeGalleryVideo,
  isYouTubeShort,
  youtubeEmbedUrl,
  youtubeThumb,
} from "@/lib/youtube";
import {
  sectionEyebrowClass,
  sectionEyebrowDotClass,
  sectionHeadingAccentSpanClass,
  sectionHeadingSolidClass,
} from "./sectionStyles";

type Props = {
  videos: GalleryItem[];
  /** home = full marketing section; product = compact block above reviews */
  variant?: "home" | "product";
};

function VideoThumb({ item }: { item: GalleryItem }) {
  if (isYouTubeGalleryVideo(item) && item.youtubeId) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={youtubeThumb(item.youtubeId)}
        alt=""
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
    );
  }
  return (
    <video
      src={item.url}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
      muted
      playsInline
      preload="metadata"
    />
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/55 text-white flex items-center justify-center shadow-xl ring-2 ring-white/20 group-hover:scale-110 transition-transform">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}

export default function HomeVideoGallery({ videos, variant = "home" }: Props) {
  const featured = videos.slice(0, 4);
  const rest = videos.slice(4);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const isProduct = variant === "product";

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const popup =
    portalReady &&
    active &&
    createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <button
          type="button"
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          aria-label="Close video"
          onClick={() => setActive(null)}
        />
        <button
          type="button"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[10001] text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full"
          onClick={() => setActive(null)}
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative z-[10000] w-full max-w-[min(100%,920px)] flex justify-center" onClick={(e) => e.stopPropagation()}>
          {isYouTubeGalleryVideo(active) && active.youtubeId ? (
            <div
              className={`overflow-hidden rounded-[24px] bg-black shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${
                isYouTubeShort(active)
                  ? "w-[min(100%,380px)] aspect-[9/16] max-h-[min(86vh,720px)]"
                  : "w-full aspect-video max-h-[85vh]"
              }`}
            >
              <iframe
                key={active.youtubeId}
                title="Home video"
                src={youtubeEmbedUrl(active.youtubeId)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : isFileGalleryVideo(active) ? (
            <div className="w-[min(100%,420px)] max-h-[86vh] overflow-hidden rounded-[24px] bg-black shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
              <video
                key={active.id}
                src={active.url}
                className="w-full max-h-[86vh] object-contain"
                controls
                playsInline
                autoPlay
              />
            </div>
          ) : null}
        </div>
      </div>,
      document.body
    );

  return (
    <section
      className={
        isProduct
          ? "relative w-full overflow-hidden"
          : "relative w-full bg-white py-12 sm:py-16 md:py-[80px] xl:py-[100px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto overflow-hidden"
      }
    >
      <div className={`w-full ${isProduct ? "mb-6 md:mb-8" : "mb-8 xl:mb-12"}`}>
        <span className={sectionEyebrowClass}>
          <span className={sectionEyebrowDotClass} />
          {isProduct ? "Product videos" : "Videos"}
        </span>
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 w-full">
          <h2 className={isProduct ? "text-xl md:text-2xl xl:text-3xl font-malayalam-display font-bold text-[#0c1622] leading-snug" : sectionHeadingSolidClass}>
            {isProduct ? (
              <>
                ഉൽപ്പന്ന{" "}
                <span className={sectionHeadingAccentSpanClass}>വീഡിയോകൾ</span>
              </>
            ) : (
              <>
                ഞങ്ങളുടെ{" "}
                <span className={sectionHeadingAccentSpanClass}>വീഡിയോകൾ</span>
              </>
            )}
          </h2>
          {!isProduct && (
            <Link
              href="/gallery"
              className="shrink-0 self-start sm:self-center flex items-center justify-center gap-2 sm:gap-3 rounded-full group font-malayalam font-bold text-sm px-6 py-3 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] hover:brightness-110 transition-all transform hover:scale-105 text-white shadow-[0_10px_30px_rgba(41,66,94,0.3)] md:text-base"
            >
              കൂടുതൽ കാണുക
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
        </div>
        {!isProduct && (
          <p className="mt-3 text-gray-600 text-base sm:text-lg font-malayalam leading-[1.8] max-w-2xl">
            ക്ലാസ് നിമിഷങ്ങളും ടിപ്പുകളും — കാണുക, പഠിക്കുക, ആത്മവിശ്വാസം വളർത്തുക.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 xl:gap-5">
        {featured.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item)}
            className={`group relative w-full aspect-[3/4] overflow-hidden bg-gray-100 border border-[#29425e]/08 hover:shadow-xl transition-all hover:-translate-y-0.5 text-left ${
              isProduct ? "rounded-2xl shadow-sm" : "rounded-[22px] sm:rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            }`}
            aria-label="Play video"
          >
            <VideoThumb item={item} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1622]/45 via-transparent to-transparent opacity-80" />
            <PlayBadge />
          </button>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-5 sm:mt-7">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#395c80]">More videos</p>
            <p className="text-xs text-gray-400 hidden sm:block">Swipe to explore</p>
          </div>
          <div
            className="flex gap-3 sm:gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {rest.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item)}
                className="group relative shrink-0 w-[42vw] xs:w-[38vw] sm:w-[200px] md:w-[220px] xl:w-[240px] snap-start aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-[#29425e]/08 shadow-sm hover:shadow-lg transition-all text-left"
                aria-label="Play video"
              >
                <VideoThumb item={item} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1622]/45 via-transparent to-transparent opacity-80" />
                <PlayBadge />
              </button>
            ))}
          </div>
        </div>
      )}

      {popup}
    </section>
  );
}
