"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  date: string;
};

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] transition-shadow";
const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

const AVATAR_TONES = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-800",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function avatarTone(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i) * (i + 1)) % AVATAR_TONES.length;
  return AVATAR_TONES[hash];
}

function Stars({
  value,
  size = "sm",
  interactive = false,
  onChange,
}: {
  value: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (n: number) => void;
}) {
  const cls = size === "md" ? "w-7 h-7" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = (
          <svg
            key={n}
            className={`${cls} ${filled ? "text-amber-400" : "text-gray-200"} ${interactive ? "transition-transform hover:scale-110" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
        if (!interactive) return star;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            className="p-0.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<"all" | "5" | "4" | "low">("all");
  const [saveError, setSaveError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    setPortalReady(true);
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!showForm && !deleteId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showForm, deleteId]);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setContent("");
    setRating(5);
    setSaveError("");
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setName(t.name || "");
    setRole(t.role || "");
    setContent(t.content || "");
    setRating(Number(t.rating) || 5);
    setSaveError("");
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");

    try {
      const payload = { name, role, content, rating };
      const res = editingId
        ? await fetch("/api/testimonials", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...payload }),
          })
        : await fetch("/api/testimonials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) throw new Error("Save failed");
      closeForm();
      fetchTestimonials();
    } catch (error) {
      console.error("Failed to save testimonial", error);
      setSaveError("Could not save. Please try again.");
    }
    setIsSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/testimonials?id=${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchTestimonials();
    } catch (error) {
      console.error("Failed to delete testimonial", error);
    }
    setIsDeleting(false);
  };

  const avgRating = useMemo(() => {
    if (!testimonials.length) return 0;
    const sum = testimonials.reduce((acc, t) => acc + (Number(t.rating) || 0), 0);
    return Math.round((sum / testimonials.length) * 10) / 10;
  }, [testimonials]);

  const fiveStarCount = useMemo(
    () => testimonials.filter((t) => Number(t.rating) === 5).length,
    [testimonials]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return testimonials.filter((t) => {
      const r = Number(t.rating) || 0;
      if (ratingFilter === "5" && r !== 5) return false;
      if (ratingFilter === "4" && r !== 4) return false;
      if (ratingFilter === "low" && r >= 4) return false;
      if (!q) return true;
      return (
        t.name?.toLowerCase().includes(q) ||
        t.role?.toLowerCase().includes(q) ||
        t.content?.toLowerCase().includes(q)
      );
    });
  }, [testimonials, query, ratingFilter]);

  const deleteTarget = testimonials.find((t) => t.id === deleteId);

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#0c1622]">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            Customer quotes shown on the homepage — add, edit, or remove anytime.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchTestimonials}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#0c1622] hover:bg-gray-50 shadow-sm"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c1622] text-white text-sm font-semibold hover:bg-[#29425e] shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add testimonial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Published", value: String(testimonials.length) },
          { label: "Avg rating", value: testimonials.length ? `${avgRating}★` : "—" },
          { label: "5-star", value: String(fiveStarCount) },
          { label: "Showing", value: String(filtered.length) },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-[#0c1622]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, role, or review…"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#395c80]/15 focus:border-[#395c80]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "All" },
                { key: "5", label: "5 stars" },
                { key: "4", label: "4 stars" },
                { key: "low", label: "3 & below" },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setRatingFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  ratingFilter === f.key
                    ? "bg-[#0c1622] text-white border-[#0c1622]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-5 animate-pulse space-y-4">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-32 bg-gray-100 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-[80%] bg-gray-100 rounded" />
                <div className="h-3 w-[60%] bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-[#FAFBFC] py-16 px-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-[#0c1622]">
              {testimonials.length === 0 ? "No testimonials yet" : "No matches"}
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {testimonials.length === 0
                ? "Add a customer quote to feature on the homepage."
                : "Try another search or clear the rating filter."}
            </p>
            {testimonials.length === 0 && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c1622] text-white text-sm font-semibold hover:bg-[#29425e]"
              >
                Add first testimonial
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <article
                key={t.id}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${avatarTone(t.name || "U")}`}
                    >
                      {(t.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[#0c1622] truncate">{t.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{t.role}</p>
                    </div>
                  </div>
                  <Stars value={Number(t.rating) || 0} />
                </div>

                <p className="mt-4 text-sm text-gray-600 leading-relaxed flex-1 line-clamp-4">
                  “{t.content}”
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-400">{formatDate(t.date)}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(t)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#395c80] bg-[#F4F7FA] hover:bg-[#e8eef5] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(t.id)}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      aria-label={`Delete ${t.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {portalReady &&
        showForm &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={closeForm} />
            <div className="relative w-full max-w-lg max-h-[min(92vh,720px)] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-auto">
              <div className="shrink-0 px-5 py-4 border-b border-gray-100 bg-[#FAFBFC] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {editingId ? "Edit testimonial" : "New testimonial"}
                  </div>
                  <div className="text-lg font-semibold text-[#0c1622] truncate">
                    {name || "Customer quote"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form
                id="testimonial-editor-form"
                onSubmit={handleSave}
                className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4"
              >
                <div>
                  <label className={labelClass}>Customer name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Rahul Krishnan"
                  />
                </div>
                <div>
                  <label className={labelClass}>Role / designation</label>
                  <input
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Student, Kochi"
                  />
                </div>
                <div>
                  <label className={labelClass}>Rating</label>
                  <div className="flex items-center gap-3">
                    <Stars value={rating} size="md" interactive onChange={setRating} />
                    <span className="text-sm font-semibold text-gray-500">{rating} / 5</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Review</label>
                  <textarea
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="What did they say?"
                  />
                </div>

                {(name || content) && (
                  <div className="rounded-xl border border-gray-100 bg-[#FAFBFC] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Preview
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Stars value={rating} />
                      <span className="text-sm font-bold text-[#0c1622]">{name || "Name"}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      “{content || "Review text…"}”
                    </p>
                  </div>
                )}

                {saveError && (
                  <p className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
                    {saveError}
                  </p>
                )}
              </form>

              <div className="shrink-0 px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="testimonial-editor-form"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#0c1622] text-white text-sm font-semibold hover:bg-[#29425e] disabled:opacity-70"
                >
                  {isSaving ? "Saving…" : editingId ? "Update" : "Publish"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {portalReady &&
        deleteId &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
              onClick={() => !isDeleting && setDeleteId(null)}
            />
            <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden p-6">
              <h3 className="text-lg font-semibold text-[#0c1622]">Delete this testimonial?</h3>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium text-gray-700">{deleteTarget?.name || "This review"}</span>{" "}
                will be removed from the homepage. This cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-70"
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
