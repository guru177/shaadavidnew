"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_LEGAL_PAGES,
  LEGAL_NAV,
  LEGAL_SLUGS,
  type LegalPage,
  type LegalPagesMap,
  type LegalSlug,
} from "@/types/legal";

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]";
const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

export default function AdminLegalPage() {
  const [pages, setPages] = useState<LegalPagesMap>(DEFAULT_LEGAL_PAGES);
  const [active, setActive] = useState<LegalSlug>("privacy-policy");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/legal")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setPages({ ...DEFAULT_LEGAL_PAGES, ...data });
        }
      })
      .catch(() => setError("Failed to load legal pages"))
      .finally(() => setIsLoading(false));
  }, []);

  const current = pages[active];

  const updateCurrent = (patch: Partial<LegalPage>) => {
    setPages((prev) => ({
      ...prev,
      [active]: { ...prev[active], ...patch, slug: active },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/legal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pages[active],
          lastUpdated: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      setPages((prev) => ({ ...prev, [active]: saved }));
      setMessage(`${saved.title} saved.`);
    } catch {
      setError("Could not save. Please try again.");
    }
    setIsSaving(false);
  };

  const resetDefault = () => {
    const def = DEFAULT_LEGAL_PAGES[active];
    updateCurrent({
      title: def.title,
      content: def.content,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
  };

  const wordCount = useMemo(() => {
    return (current?.content || "").trim().split(/\s+/).filter(Boolean).length;
  }, [current?.content]);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Loading legal pages…</div>;
  }

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#0c1622]">Legal pages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit Privacy, Terms, Refund, and Cookie policies shown in the footer.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/legal/${active}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#0c1622] hover:bg-gray-50 shadow-sm"
          >
            View live
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c1622] text-white text-sm font-semibold hover:bg-[#29425e] disabled:opacity-70 shadow-sm"
          >
            {isSaving ? "Saving…" : "Save page"}
          </button>
        </div>
      </div>

      {(message || error) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium border ${
            error
              ? "bg-rose-50 text-rose-700 border-rose-100"
              : "bg-emerald-50 text-emerald-700 border-emerald-100"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 pt-3 border-b border-gray-100 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {LEGAL_SLUGS.map((slug) => {
              const meta = LEGAL_NAV.find((n) => n.slug === slug)!;
              const selected = active === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => {
                    setActive(slug);
                    setPreview(false);
                    setMessage("");
                    setError("");
                  }}
                  className={`px-3.5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                    selected
                      ? "border-[#0c1622] text-[#0c1622]"
                      : "border-transparent text-gray-500 hover:text-[#0c1622] hover:bg-gray-50"
                  }`}
                >
                  {pages[slug]?.title || meta.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-600">
                /legal/{active}
              </span>
              <span>· {wordCount} words</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetDefault}
                className="text-sm font-semibold text-[#2C6ECB] hover:underline"
              >
                Use default text
              </button>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  preview
                    ? "bg-[#0c1622] text-white border-[#0c1622]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {preview ? "Edit mode" : "Preview"}
              </button>
            </div>
          </div>

          {!preview ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Page title</label>
                  <input
                    className={inputClass}
                    value={current.title}
                    onChange={(e) => updateCurrent({ title: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last updated</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={current.lastUpdated}
                    onChange={(e) => updateCurrent({ lastUpdated: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Content · use ### for section headings · blank line between paragraphs
                </label>
                <textarea
                  rows={18}
                  className={`${inputClass} font-mono text-[13px] leading-relaxed resize-y min-h-[360px]`}
                  value={current.content}
                  onChange={(e) => updateCurrent({ content: e.target.value })}
                  placeholder="### Heading&#10;&#10;Paragraph text…"
                />
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-[#FAFBFC] p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Preview
              </p>
              <h2 className="text-2xl font-bold text-[#0c1622] mb-2">{current.title}</h2>
              <p className="text-sm text-gray-400 mb-8">Last updated · {current.lastUpdated}</p>
              <div className="space-y-1">
                {current.content.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={i} className="h-3" />;
                  if (trimmed.startsWith("###")) {
                    return (
                      <h3 key={i} className="text-xl font-bold text-[#0c1622] mt-8 mb-3">
                        {trimmed.replace(/^###\s*/, "")}
                      </h3>
                    );
                  }
                  return (
                    <p key={i} className="text-gray-600 leading-relaxed mb-4">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
