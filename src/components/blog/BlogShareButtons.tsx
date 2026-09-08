"use client";

import React, { useState } from "react";

const btnClass =
  "w-10 h-10 rounded-full bg-white/60 border border-gray-200/50 flex items-center justify-center text-gray-500 transition-all shadow-sm backdrop-blur-sm group";

export default function BlogShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => (typeof window !== "undefined" ? window.location.href : "");

  const shareWhatsApp = () => {
    const url = getUrl();
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-malayalam">
        ഷെയർ ചെയ്യൂ:
      </span>
      <div className="flex gap-3">
        <button
          type="button"
          aria-label="Share on WhatsApp"
          onClick={shareWhatsApp}
          className={`${btnClass} hover:border-[#25D366] hover:text-white hover:bg-[#25D366]`}
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Share on Facebook"
          onClick={shareFacebook}
          className={`${btnClass} hover:border-[#1877F2] hover:text-white hover:bg-[#1877F2]`}
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Share on X"
          onClick={shareX}
          className={`${btnClass} hover:border-black hover:text-white hover:bg-black`}
        >
          <svg
            className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={copied ? "Link copied" : "Copy link"}
          onClick={copyLink}
          className={`${btnClass} hover:border-[#395c80] hover:text-white hover:bg-[#395c80] ${
            copied ? "border-emerald-500 text-emerald-600" : ""
          }`}
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {copied ? (
              <path d="M20 6L9 17l-5-5" />
            ) : (
              <>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
