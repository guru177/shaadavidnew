"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { isVideoUrl } from "@/lib/media";

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

export default function ProductGallery({ images, title }: Props) {
  const [activeTab, setActiveTab] = useState<number | "3d">(1);
  const safeImages = images?.length ? images : ["/product.webp"];
  const activeSrc = activeTab === "3d" ? null : safeImages[(activeTab as number) - 1];
  const activeIsVideo = activeSrc ? isVideoUrl(activeSrc) : false;

  return (
    <div className="lg:sticky top-28 flex flex-col gap-4">
      <div className="w-full aspect-square border border-gray-100 rounded-3xl flex items-center justify-center relative cursor-crosshair group overflow-hidden bg-gray-50">
        {activeTab === "3d" ? (
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Globe3D />
          </div>
        ) : activeIsVideo && activeSrc ? (
          <video
            key={activeSrc}
            src={activeSrc}
            className="w-full h-full object-contain bg-black"
            controls
            playsInline
            preload="metadata"
            aria-label={title}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeSrc || safeImages[0]}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt={title}
            fetchPriority="high"
          />
        )}

        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center cursor-pointer text-gray-400 hover:text-[#395c80] transition-colors z-10">
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </div>
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
