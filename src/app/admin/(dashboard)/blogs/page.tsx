"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { BlogPost } from "@/types/blog";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type Blog = BlogPost;

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] transition-shadow";
const labelClass = "block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [saveError, setSaveError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setPortalReady(true);
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!showForm && !deleteId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showForm, deleteId]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(image);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, image]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("");
    setExcerpt("");
    setContent("");
    setImage("");
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setFile(null);
    setPreviewUrl("");
    setSaveError("");
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setTitle(blog.title || "");
    setCategory(blog.category || "");
    setExcerpt(blog.excerpt || "");
    setContent(blog.content || "");
    setImage(blog.image || "");
    setSeoTitle(blog.seoTitle || "");
    setSeoDescription(blog.seoDescription || "");
    setSeoKeywords(blog.seoKeywords || "");
    setFile(null);
    setPreviewUrl(blog.image || "");
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
      let finalImageUrl = image;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      if (!finalImageUrl) {
        setSaveError("Add a cover image (upload or URL).");
        setIsSaving(false);
        return;
      }

      const payload = {
        title,
        category,
        excerpt,
        content,
        image: finalImageUrl,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        seoKeywords: seoKeywords.trim(),
      };
      const res = editingId
        ? await fetch("/api/blogs", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...payload }),
          })
        : await fetch("/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) throw new Error("Save failed");

      closeForm();
      fetchBlogs();
    } catch (error) {
      console.error("Failed to save blog", error);
      setSaveError("Could not save the post. Please try again.");
    }
    setIsSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/blogs?id=${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
    setIsDeleting(false);
  };

  const categories = useMemo(() => {
    const set = new Set(blogs.map((b) => b.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "en"));
  }, [blogs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogs.filter((b) => {
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        b.title?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q)
      );
    });
  }, [blogs, query, categoryFilter]);

  const deleteTarget = blogs.find((b) => b.id === deleteId);

  return (
    <div className="w-full space-y-5">
      <AdminPageHeader
        pill="ബ്ലോഗുകൾ"
        title="Blog posts"
        subtitle="Write, edit, and publish articles for your audience."
        actions={
          <>
            <button
              type="button"
              onClick={fetchBlogs}
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
              Write post
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Published", value: blogs.length },
          { label: "Categories", value: categories.length },
          { label: "Showing", value: filtered.length },
          {
            label: "Latest",
            value: blogs[0]?.date?.split(",")[0] || "—",
            small: true,
          },
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
              placeholder="Search title, excerpt, category…"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                categoryFilter === "all"
                  ? "bg-[#0c1622] text-white border-[#0c1622] rounded-full"
                  : "bg-white text-[#29425e] border-[#29425e]/15 hover:bg-[#29425e]/5 rounded-full"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors max-w-[180px] truncate ${
                  categoryFilter === cat
                    ? "bg-[#0c1622] text-white border-[#0c1622] rounded-full"
                    : "bg-white text-[#29425e] border-[#29425e]/15 hover:bg-[#29425e]/5 rounded-full"
                }`}
                title={cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-4 w-[80%] bg-gray-100 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-[65%] bg-gray-100 rounded" />
                </div>
              </div>
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-[#0c1622]">
              {blogs.length === 0 ? "No posts yet" : "No matches"}
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {blogs.length === 0
                ? "Publish your first article to show up here."
                : "Try another search or clear the category filter."}
            </p>
            {blogs.length === 0 && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all"
              >
                Write first post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col rounded-[24px] border border-[#29425e]/08 overflow-hidden bg-white hover:border-[#29425e]/20 hover:shadow-[0_12px_36px_rgba(12,22,34,0.08)] transition-all"
              >
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blog.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                  <span className="absolute left-3 bottom-3 max-w-[85%] truncate px-2.5 py-1 rounded-lg bg-white/95 text-[11px] font-bold text-[#0c1622] shadow-sm">
                    {blog.category}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    <span>{blog.date}</span>
                    {blog.readTime && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{blog.readTime}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-2 text-[15px] font-bold text-[#0c1622] leading-snug line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">{blog.excerpt}</p>

                  <div className="mt-4 pt-4 border-t border-[#29425e]/8 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400 truncate">
                      {blog.author || "Shaa David"}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEdit(blog)}
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
                        onClick={() => setDeleteId(blog.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        aria-label={`Delete ${blog.title}`}
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
            <div className="relative w-full max-w-3xl max-h-[min(92vh,880px)] bg-white rounded-[24px] border border-[#29425e]/10 shadow-[0_24px_60px_rgba(12,22,34,0.18)] overflow-hidden flex flex-col my-auto">
              <div className="shrink-0 px-5 py-4 border-b border-[#29425e]/8 bg-[#F7F9FB] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {editingId ? "Edit post" : "New post"}
                  </div>
                  <div className="text-lg font-semibold text-[#0c1622] truncate">
                    {title || "Untitled article"}
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

              <form id="blog-editor-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Title</label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputClass}
                      placeholder="Post title (Malayalam or English)"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <input
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Vocabulary, Grammar"
                      list="blog-categories"
                    />
                    <datalist id="blog-categories">
                      {categories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className={labelClass}>Cover image URL</label>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className={inputClass}
                      placeholder="https://…"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Or upload cover</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100/80 transition-colors px-4 py-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-sm font-semibold text-[#0c1622]">
                        {file ? file.name : "Click to choose an image"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · up to ~5MB</p>
                    </label>
                    <div className="w-full sm:w-44 shrink-0 aspect-[16/10] rounded-xl overflow-hidden border border-[#29425e]/10 bg-[#F7F9FB]">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Preview
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Excerpt</label>
                  <textarea
                    required
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Short summary shown on cards"
                  />
                </div>

                <div>
                  <label className={labelClass}>Full content</label>
                  <textarea
                    required
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`${inputClass} resize-y min-h-[180px]`}
                    placeholder="Write the full article…"
                  />
                </div>

                <div className="rounded-2xl border border-[#29425e]/10 bg-[#F7F9FB] p-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0c1622]">SEO (this post only)</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Leave blank to use the post title and excerpt.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>SEO title</label>
                    <input
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className={inputClass}
                      placeholder="Custom browser / Google title"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>SEO description</label>
                    <textarea
                      rows={2}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className={`${inputClass} resize-none`}
                      placeholder="Meta description for search results"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>SEO keywords</label>
                    <input
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      className={inputClass}
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                </div>

                {saveError && (
                  <p className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
                    {saveError}
                  </p>
                )}
              </form>

              <div className="shrink-0 px-5 py-4 border-t border-[#29425e]/8 bg-white flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 rounded-full border border-[#29425e]/12 text-sm font-semibold text-gray-700 hover:bg-[#F7F9FB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="blog-editor-form"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all disabled:opacity-70"
                >
                  {isSaving ? "Saving…" : editingId ? "Update post" : "Publish post"}
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
            <div className="relative w-full max-w-md bg-white rounded-[24px] border border-[#29425e]/10 shadow-[0_24px_60px_rgba(12,22,34,0.18)] overflow-hidden p-6">
              <h3 className="text-lg font-semibold text-[#0c1622]">Delete this post?</h3>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium text-gray-700">{deleteTarget?.title || "This post"}</span>{" "}
                will be permanently removed. This cannot be undone.
              </p>
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
