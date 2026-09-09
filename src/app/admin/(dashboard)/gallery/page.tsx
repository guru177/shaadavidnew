"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type GalleryImage = {
  id: string;
  url: string;
  date: string;
};

function formatDate(date: string) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [query, setQuery] = useState("");
  const [saveError, setSaveError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [newUrl, setNewUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState("");

  useEffect(() => {
    setPortalReady(true);
    fetchGallery();
  }, []);

  useEffect(() => {
    if (!showForm && !deleteId && !previewId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showForm, deleteId, previewId]);

  useEffect(() => {
    if (!file) {
      setLocalPreview(newUrl);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, newUrl]);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch gallery", error);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setNewUrl("");
    setFile(null);
    setLocalPreview("");
    setSaveError("");
    setDragOver(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setSaveError("Please choose an image file.");
      return;
    }
    setFile(f);
    setSaveError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl && !file) {
      setSaveError("Upload a file or paste an image URL.");
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      let finalImageUrl = newUrl;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      if (!finalImageUrl) throw new Error("No image URL");

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalImageUrl }),
      });
      if (!res.ok) throw new Error("Save failed");

      closeForm();
      fetchGallery();
    } catch (error) {
      console.error("Failed to add image", error);
      setSaveError("Could not add image. Please try again.");
    }
    setIsSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/gallery?id=${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      if (previewId === deleteId) setPreviewId(null);
      fetchGallery();
    } catch (error) {
      console.error("Failed to delete image", error);
    }
    setIsDeleting(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return images;
    return images.filter(
      (img) =>
        img.id?.toLowerCase().includes(q) ||
        img.date?.toLowerCase().includes(q) ||
        img.url?.toLowerCase().includes(q)
    );
  }, [images, query]);

  const deleteTarget = images.find((img) => img.id === deleteId);
  const previewTarget = images.find((img) => img.id === previewId);
  const latestDate = images[0]?.date ? formatDate(images[0].date) : "—";

  return (
    <div className="w-full space-y-5">
      <AdminPageHeader
        pill="ഗാലറി"
        title="Gallery"
        subtitle="Upload and manage images shown on the public gallery page."
        actions={
          <>
            <button
              type="button"
              onClick={fetchGallery}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-[#29425e] bg-white border border-[#29425e]/15 hover:bg-[#29425e]/5 shadow-sm transition-colors"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add image
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Published", value: String(images.length) },
          { label: "Showing", value: String(filtered.length) },
          { label: "Latest upload", value: latestDate, small: true },
          { label: "Tip", value: "1:1 · 5MB", small: true },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-[24px] border border-[#29425e]/08 shadow-[0_8px_30px_rgba(12,22,34,0.04)] px-4 py-3.5"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{s.label}</p>
            <p
              className={`mt-1 font-bold text-[#0c1622] ${s.small ? "text-sm truncate" : "text-2xl"}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[24px] border border-[#29425e]/08 shadow-[0_8px_30px_rgba(12,22,34,0.04)] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
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
              placeholder="Search by date, id, or URL…"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]"
            />
          </div>
          <p className="text-xs text-gray-400 font-medium sm:text-right">
            Hover an image for view / delete · tap on mobile
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gray-100 border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#29425e]/15 bg-[#F7F9FB] py-16 px-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-[#0c1622]">
              {images.length === 0 ? "Gallery is empty" : "No matches"}
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {images.length === 0
                ? "Add your first image to show on the public gallery."
                : "Try another search term."}
            </p>
            {images.length === 0 && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all"
              >
                Add first image
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((img) => (
              <article
                key={img.id}
                className="group relative aspect-square rounded-[24px] overflow-hidden border border-[#29425e]/08 bg-[#F7F9FB] shadow-sm hover:shadow-[0_12px_36px_rgba(12,22,34,0.08)] hover:border-[#29425e]/20 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-1 rounded-lg bg-white/95 text-[10px] font-bold text-[#0c1622] shadow-sm truncate max-w-[70%]">
                    {formatDate(img.date)}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setPreviewId(img.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-xs font-semibold text-[#0c1622] hover:bg-[#F7F9FB] shadow-sm"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(img.id)}
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                    aria-label="Delete image"
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
            <div className="relative w-full max-w-lg max-h-[min(92vh,760px)] bg-white rounded-[24px] border border-[#29425e]/10 shadow-[0_24px_60px_rgba(12,22,34,0.18)] overflow-hidden flex flex-col my-auto">
              <div className="shrink-0 px-5 py-4 border-b border-[#29425e]/8 bg-[#F7F9FB] flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    New image
                  </div>
                  <div className="text-lg font-semibold text-[#0c1622]">Add to gallery</div>
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
                id="gallery-editor-form"
                onSubmit={handleSave}
                className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4"
              >
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    pickFile(e.dataTransfer.files?.[0] || null);
                  }}
                  className={`rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                    dragOver
                      ? "border-[#395c80] bg-[#395c80]/5"
                      : "border-[#29425e]/12 bg-[#F7F9FB] hover:bg-[#395c80]/10"
                  }`}
                >
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0] || null)}
                    />
                    <div className="mx-auto w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-[#0c1622]">
                      {file ? file.name : "Drop an image here, or click to browse"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Recommended 1000×1000 · JPG, PNG, WebP · max ~5MB
                    </p>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    or paste URL
                  </span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                <div>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => {
                      setNewUrl(e.target.value);
                      if (e.target.value) setFile(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]"
                    placeholder="https://…"
                  />
                </div>

                <div className="aspect-square max-w-[220px] mx-auto rounded-2xl overflow-hidden border border-[#29425e]/10 bg-[#F7F9FB]">
                  {localPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={localPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      Preview
                    </div>
                  )}
                </div>

                {saveError && (
                  <p className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
                    {saveError}
                  </p>
                )}
              </form>

              <div className="shrink-0 px-5 py-4 border-t border-[#29425e]/8 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 rounded-full border border-[#29425e]/12 text-sm font-semibold text-gray-700 hover:bg-[#F7F9FB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="gallery-editor-form"
                  disabled={isSaving || (!file && !newUrl)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all disabled:opacity-70"
                >
                  {isSaving ? "Uploading…" : "Add to gallery"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {portalReady &&
        previewTarget &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
              onClick={() => setPreviewId(null)}
            />
            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 text-white">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{formatDate(previewTarget.date)}</p>
                  <p className="text-xs text-white/60 truncate">{previewTarget.id}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewId(null);
                      setDeleteId(previewTarget.id);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewId(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
                    aria-label="Close preview"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewTarget.url}
                  alt=""
                  className="w-full max-h-[75vh] object-contain"
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {portalReady &&
        deleteId &&
        createPortal(
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
              onClick={() => !isDeleting && setDeleteId(null)}
            />
            <div className="relative w-full max-w-md bg-white rounded-[24px] border border-[#29425e]/10 shadow-[0_24px_60px_rgba(12,22,34,0.18)] overflow-hidden p-6">
              <div className="flex gap-4">
                {deleteTarget && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={deleteTarget.url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-[#0c1622]">Delete this image?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    It will be removed from the public gallery. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2.5 rounded-full border border-[#29425e]/12 text-sm font-semibold text-gray-700 hover:bg-[#F7F9FB] transition-colors"
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
