"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryItem, GalleryMediaType } from "@/lib/youtube";
import {
  isFileGalleryVideo,
  isGalleryVideo,
  isYouTubeGalleryVideo,
  isYouTubeShort,
  youtubeEmbedUrl,
  youtubeThumb,
} from "@/lib/youtube";

const fallbackItems: GalleryItem[] = [
  { id: "fallback-1", type: "image", url: "/gallery/gallery-01.webp", date: "" },
  { id: "fallback-2", type: "image", url: "/gallery/gallery-03.webp", date: "" },
  { id: "fallback-3", type: "image", url: "/gallery/gallery-04.webp", date: "" },
];

type Props = {
  initialItems?: GalleryItem[];
};

export default function GalleryGrid({ initialItems }: Props) {
  const allItems =
    initialItems && initialItems.length > 0 ? initialItems : fallbackItems;

  const [tab, setTab] = useState<GalleryMediaType>("image");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  const items = useMemo(
    () =>
      allItems.filter((item) =>
        tab === "video" ? item.type === "video" : item.type !== "video"
      ),
    [allItems, tab]
  );

  const counts = useMemo(
    () => ({
      image: allItems.filter((i) => i.type !== "video").length,
      video: allItems.filter((i) => i.type === "video").length,
    }),
    [allItems]
  );

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setSelectedIndex(null);
  }, [tab]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev! < items.length - 1 ? prev! + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : items.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, items.length]);

  const selected = selectedIndex !== null ? items[selectedIndex] : null;
  const closePlayer = () => setSelectedIndex(null);

  const videoPopup =
    portalReady &&
    selected &&
    selectedIndex !== null &&
    createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Video player"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-default"
          aria-label="Close video"
          onClick={closePlayer}
        />

        <button
          type="button"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[10001] text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
          onClick={closePlayer}
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute top-5 left-5 sm:top-6 sm:left-8 z-[10001] text-white/50 font-mono text-sm tracking-[0.2em]">
          <span className="text-white font-bold">{selectedIndex + 1}</span> / {items.length}
        </div>

        <div
          className="relative z-[10000] flex items-center justify-center w-full max-w-[min(100%,920px)]"
          onClick={(e) => e.stopPropagation()}
        >
          {isYouTubeGalleryVideo(selected) && selected.youtubeId ? (
            <div
              className={`overflow-hidden rounded-[24px] sm:rounded-[28px] bg-black shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${
                isYouTubeShort(selected)
                  ? "w-[min(100%,380px)] aspect-[9/16] max-h-[min(86vh,720px)]"
                  : "w-full aspect-video max-h-[85vh]"
              }`}
            >
              <iframe
                key={selected.youtubeId}
                title={`Gallery video ${selectedIndex + 1}`}
                src={youtubeEmbedUrl(selected.youtubeId)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : isFileGalleryVideo(selected) ? (
            <div className="w-[min(100%,420px)] max-h-[86vh] overflow-hidden rounded-[24px] sm:rounded-[28px] bg-black shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
              <video
                key={selected.id}
                src={selected.url}
                className="w-full max-h-[86vh] object-contain"
                controls
                playsInline
                autoPlay
              />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.url}
              alt={`Full size ${selectedIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-[24px] shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
            />
          )}

          {items.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-white/15 backdrop-blur-md rounded-full"
                onClick={() =>
                  setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : items.length - 1))
                }
                aria-label="Previous"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-white/15 backdrop-blur-md rounded-full"
                onClick={() =>
                  setSelectedIndex((prev) => (prev! < items.length - 1 ? prev! + 1 : 0))
                }
                aria-label="Next"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div className="flex justify-center mb-8 sm:mb-10">
        <div className="inline-flex rounded-full border border-[#29425e]/12 bg-white p-1 shadow-sm">
          {(
            [
              { key: "image" as const, label: "Images", count: counts.image },
              { key: "video" as const, label: "Videos", count: counts.video },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "bg-[#0c1622] text-white shadow-sm"
                  : "text-[#395c80] hover:text-[#0c1622]"
              }`}
            >
              {t.label}
              <span
                className={`ml-1.5 text-xs ${
                  tab === t.key ? "text-white/70" : "text-gray-400"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#29425e]/15 bg-white py-16 px-6 text-center max-w-xl mx-auto">
          <p className="text-lg font-semibold text-[#0c1622]">
            {tab === "video" ? "No videos yet" : "No images yet"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {tab === "video"
              ? "YouTube videos or uploads added in admin will appear here."
              : "Gallery images will appear here once published."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 xl:gap-8 max-w-[1400px] mx-auto justify-items-stretch">
          {items.map((item, index) => {
            const video = isGalleryVideo(item);
            const yt = isYouTubeGalleryVideo(item);
            const fileVid = isFileGalleryVideo(item);
            const thumb = yt && item.youtubeId ? youtubeThumb(item.youtubeId) : item.url;
            return (
              <button
                key={item.id}
                type="button"
                className="relative w-full aspect-[3/4] rounded-[28px] overflow-hidden group bg-gray-100 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer text-left"
                onClick={() => setSelectedIndex(index)}
                aria-label={video ? `Play video ${index + 1}` : `View image ${index + 1}`}
              >
                {fileVid ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={video ? `Gallery video ${index + 1}` : `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1622]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-5 left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="bg-white/90 backdrop-blur-md text-[#0c1622] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {video ? "Video" : "Gallery"}
                  </span>
                </div>

                {video ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 bg-black/55 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl ring-2 ring-white/20 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {videoPopup}
    </>
  );
}
