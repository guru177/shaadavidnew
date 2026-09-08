"use client";

import React from "react";
import Link from "next/link";
import {
  sectionEyebrowClass,
  sectionEyebrowDotClass,
  sectionHeadingSolidClass,
  sectionHeadingAccentSpanClass,
} from "./sectionStyles";

const INSTAGRAM_HANDLE = "shaa_davids_english_companion";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
const INSTAGRAM_EMBED = `https://www.instagram.com/${INSTAGRAM_HANDLE}/embed`;

export default function InstagramSection() {
  return (
    <section className="relative w-full bg-[#FAFAFA] py-[80px] md:py-[100px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16 items-center">
        <div className="lg:col-span-6 flex flex-col items-start">
          <span className={sectionEyebrowClass}>
            <span className={sectionEyebrowDotClass} />
            Instagram
          </span>

          <h2 className={sectionHeadingSolidClass}>
            ഞങ്ങളുടെ യാത്ര{" "}
            <span className={sectionHeadingAccentSpanClass}>ഇൻസ്റ്റാഗ്രാമിൽ</span>
          </h2>

          <p className="mt-4 text-gray-600 text-base sm:text-lg font-malayalam leading-[1.8]">
            ക്ലാസ് നിമിഷങ്ങൾ, പഠന ടിപ്പുകൾ, പുതിയ അപ്‌ഡേറ്റുകൾ — എല്ലാം ഒരിടത്ത്. ഞങ്ങളെ പിന്തുടർന്ന് നിങ്ങളുടെ ഇംഗ്ലീഷ് യാത്രയോടൊപ്പം നടക്കൂ.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#0c1622] text-white px-6 py-3.5 text-sm font-bold hover:bg-[#29425e] transition-colors shadow-[0_10px_30px_rgba(41,66,94,0.25)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
              Follow us
            </Link>
            <span className="text-sm text-gray-500 font-medium tracking-wide">
              @{INSTAGRAM_HANDLE}
            </span>
          </div>

          <div className="mt-10 w-full max-w-lg">
            <div className="grid grid-cols-3 divide-x divide-[#29425e]/12 border-y border-[#29425e]/10">
              {[
                { label: "Tips", value: "Daily" },
                { label: "Classes", value: "Live" },
                { label: "Updates", value: "New" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group flex flex-col items-center justify-center px-2 py-5 sm:py-6 text-center transition-colors"
                >
                  <span className="mb-2 h-px w-6 bg-[linear-gradient(90deg,transparent,#395c80,#29425e,#395c80,transparent)] opacity-70 group-hover:w-10 group-hover:opacity-100 transition-all duration-500" />
                  <p className="font-malayalam-display text-[#0c1622] text-xl sm:text-2xl font-bold tracking-tight leading-none">
                    {item.value}
                  </p>
                  <p className="mt-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#395c80]/80">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 w-full">
          <div className="rounded-[28px] border border-gray-100 bg-white p-2 sm:p-3 shadow-[0_16px_50px_rgba(15,23,42,0.06)] overflow-hidden">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#0c1622] flex items-center justify-center text-white shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0c1622] truncate">Shaa David</p>
                  <p className="text-[11px] text-gray-400 truncate">@{INSTAGRAM_HANDLE}</p>
                </div>
              </div>
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#395c80] hover:text-[#0c1622] transition-colors shrink-0"
              >
                View profile
              </Link>
            </div>

            <div className="rounded-[22px] overflow-hidden border border-gray-100 bg-white">
              <iframe
                title="Shaa David's English Companion on Instagram"
                src={INSTAGRAM_EMBED}
                className="w-full border-0 block"
                style={{ height: 460 }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="encrypted-media; clipboard-write"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
