"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Product, ProductReview, ProductSpecRow } from "@/types/product";
import { getStockQty, isProductInStock } from "@/lib/stock";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";

const emptyForm = {
  title: "",
  titleEn: "",
  shortDescription: "",
  slug: "",
  description: "",
  moreInfo: "",
  price: 499,
  mrp: 999,
  discountPercent: 50,
  inStock: true,
  stock: 10,
  features: [""] as string[],
  images: [""] as string[],
  bookDetails: [{ label: "", value: "" }] as ProductSpecRow[],
  dimensions: [{ label: "", value: "" }] as ProductSpecRow[],
  breadcrumbs: ["ഹോം", "പുസ്തകങ്ങളും പഠനസാമഗ്രികളും", "ഇംഗ്ലീഷ് പഠനം"] as string[],
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

type FormState = typeof emptyForm;
type TabKey = "all" | "active" | "out" | "reviews";
type SortKey = "title" | "price-high" | "price-low" | "stock";
type ReviewStatusFilter = "all" | "pending" | "approved" | "rejected";
type ReviewSortKey = "newest" | "oldest" | "rating-high" | "rating-low";

function calcDiscount(price: number, mrp: number) {
  if (!mrp || mrp <= 0) return 0;
  return Math.max(0, Math.round(((mrp - price) / mrp) * 100));
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploadFiles, setUploadFiles] = useState<(File | null)[]>([]);
  const [error, setError] = useState("");

  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("title");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const [reviewStatusFilter, setReviewStatusFilter] = useState<ReviewStatusFilter>("all");
  const [reviewProductFilter, setReviewProductFilter] = useState("all");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewSort, setReviewSort] = useState<ReviewSortKey>("newest");
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [showReviewFilters, setShowReviewFilters] = useState(false);
  const { ask, dialog: confirmDialog } = useAdminConfirm();

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const reviewCounts = useMemo(() => {
    const pending = reviews.filter((r) => r.status === "pending").length;
    const approved = reviews.filter((r) => r.status === "approved" || !r.status).length;
    const rejected = reviews.filter((r) => r.status === "rejected").length;
    return { all: reviews.length, pending, approved, rejected };
  }, [reviews]);

  const counts = useMemo(
    () => ({
      all: products.length,
      active: products.filter((p) => isProductInStock(p)).length,
      out: products.filter((p) => !isProductInStock(p)).length,
      reviews: reviews.length,
    }),
    [products, reviews.length]
  );

  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (reviewStatusFilter !== "all") {
      list = list.filter((r) => (r.status || "approved") === reviewStatusFilter);
    }

    if (reviewProductFilter !== "all") {
      list = list.filter((r) => r.productId === reviewProductFilter);
    }

    const q = reviewSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        const product = products.find((p) => p.id === r.productId);
        return [r.name, r.title, r.content, product?.titleEn, product?.title, String(r.rating)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    }

    list.sort((a, b) => {
      if (reviewSort === "rating-high") return Number(b.rating) - Number(a.rating);
      if (reviewSort === "rating-low") return Number(a.rating) - Number(b.rating);
      const da = new Date(a.date).getTime() || 0;
      const db = new Date(b.date).getTime() || 0;
      if (reviewSort === "oldest") return da - db;
      return db - da;
    });

    return list;
  }, [reviews, products, reviewStatusFilter, reviewProductFilter, reviewSearch, reviewSort]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (tab === "active") list = list.filter((p) => isProductInStock(p));
    if (tab === "out") list = list.filter((p) => !isProductInStock(p));

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.titleEn, p.title, p.slug, String(p.price)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    list.sort((a, b) => {
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "stock") return getStockQty(b) - getStockQty(a);
      return String(a.titleEn || a.title).localeCompare(String(b.titleEn || b.title));
    });

    return list;
  }, [products, tab, search, sort]);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (!showForm) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showForm]);

  useEffect(() => {
    setSelectedIds([]);
  }, [tab, search, sort]);

  useEffect(() => {
    setSelectedReviewIds([]);
  }, [reviewStatusFilter, reviewProductFilter, reviewSearch, reviewSort, tab]);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [productsRes, reviewsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/reviews?status=all"),
      ]);
      const productsData = await productsRes.json();
      const reviewsData = await reviewsRes.json();
      setProducts(Array.isArray(productsData) ? productsData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setUploadFiles([]);
    setEditingId(null);
    setError("");
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title || "",
      titleEn: product.titleEn || "",
      shortDescription: product.shortDescription || "",
      slug: product.slug || "",
      description: product.description || "",
      moreInfo: product.moreInfo || "",
      price: Number(product.price) || 0,
      mrp: Number(product.mrp) || 0,
      discountPercent: Number(product.discountPercent) || 0,
      inStock: isProductInStock(product),
      stock: getStockQty(product),
      features: product.features?.length ? [...product.features] : [""],
      images: product.images?.length ? [...product.images] : [""],
      bookDetails: product.bookDetails?.length
        ? product.bookDetails.map((r) => ({ ...r }))
        : [{ label: "", value: "" }],
      dimensions: product.dimensions?.length
        ? product.dimensions.map((r) => ({ ...r }))
        : [{ label: "", value: "" }],
      breadcrumbs: product.breadcrumbs?.length
        ? [...product.breadcrumbs]
        : ["ഹോം", "പുസ്തകങ്ങളും പഠനസാമഗ്രികളും", "ഇംഗ്ലീഷ് പഠനം"],
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
      seoKeywords: product.seoKeywords || "",
    });
    setUploadFiles([]);
    setShowForm(true);
    setError("");
  };

  const updatePriceFields = (nextPrice: number, nextMrp: number) => {
    setForm((prev) => ({
      ...prev,
      price: nextPrice,
      mrp: nextMrp,
      discountPercent: calcDiscount(nextPrice, nextMrp),
    }));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    if (!uploadRes.ok) throw new Error("Image upload failed");
    const uploadData = await uploadRes.json();
    return uploadData.url as string;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const images = [...form.images];
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        if (file) images[i] = await uploadImage(file);
      }

      const cleanedImages = images.map((img) => img.trim()).filter(Boolean);
      if (!cleanedImages.length) throw new Error("Add at least one product image");

      const payload = {
        title: form.title.trim(),
        titleEn: form.titleEn.trim(),
        shortDescription: form.shortDescription.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        moreInfo: form.moreInfo.trim(),
        price: Number(form.price),
        mrp: Number(form.mrp),
        discountPercent: calcDiscount(Number(form.price), Number(form.mrp)),
        stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
        inStock: Math.max(0, Math.floor(Number(form.stock) || 0)) > 0,
        features: form.features.map((f) => f.trim()).filter(Boolean),
        images: cleanedImages,
        bookDetails: form.bookDetails.filter((r) => r.label.trim() || r.value.trim()),
        dimensions: form.dimensions.filter((r) => r.label.trim() || r.value.trim()),
        breadcrumbs: form.breadcrumbs.map((b) => b.trim()).filter(Boolean),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        seoKeywords: form.seoKeywords.trim(),
      };

      if (editingId) {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update product");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create product");
        }
      }

      resetForm();
      setShowForm(false);
      await fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await ask({
      title: "Delete this product?",
      description: "The product and its reviews will be removed. This cannot be undone.",
      confirmLabel: "Delete product",
    });
    if (!ok) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (editingId === id) {
        resetForm();
        setShowForm(false);
      }
      fetchAll();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    const ok = await ask({
      title: "Delete this review?",
      description: "This review will be permanently removed.",
      confirmLabel: "Delete review",
    });
    if (!ok) return;
    try {
      await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      fetchAll();
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  const handleReviewStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update review");
      }
      fetchAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update review");
    }
  };

  const handleBulkReviewStatus = async (status: "approved" | "rejected") => {
    if (selectedReviewIds.length === 0) return;
    setIsBulkUpdating(true);
    try {
      await Promise.all(
        selectedReviewIds.map((id) =>
          fetch("/api/reviews", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
          })
        )
      );
      setSelectedReviewIds([]);
      await fetchAll();
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkDeleteReviews = async () => {
    if (selectedReviewIds.length === 0) return;
    const ok = await ask({
      title: `Delete ${selectedReviewIds.length} review${selectedReviewIds.length > 1 ? "s" : ""}?`,
      description: "Selected reviews will be permanently removed.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    setIsBulkUpdating(true);
    try {
      await Promise.all(
        selectedReviewIds.map((id) => fetch(`/api/reviews?id=${id}`, { method: "DELETE" }))
      );
      setSelectedReviewIds([]);
      await fetchAll();
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const allReviewsSelected =
    filteredReviews.length > 0 && filteredReviews.every((r) => selectedReviewIds.includes(r.id));

  const toggleSelectAllReviews = () => {
    if (allReviewsSelected) setSelectedReviewIds([]);
    else setSelectedReviewIds(filteredReviews.map((r) => r.id));
  };

  const toggleSelectReview = (id: string) => {
    setSelectedReviewIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleStock = async (product: Product) => {
    const qty = getStockQty(product);
    const nextStock = qty > 0 ? 0 : 1;
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, stock: nextStock, inStock: nextStock > 0 }),
    });
    fetchAll();
  };

  const updateProductStock = async (productId: string, stock: number) => {
    const qty = Math.max(0, Math.floor(stock) || 0);
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, stock: qty, inStock: qty > 0 }),
    });
    fetchAll();
  };

  const allSelected =
    filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredProducts.map((p) => p.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkStock = async (inStock: boolean) => {
    if (!selectedIds.length) return;
    setIsBulkUpdating(true);
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const product = products.find((p) => p.id === id);
          const qty = inStock ? Math.max(getStockQty(product), 1) : 0;
          return fetch("/api/products", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, stock: qty, inStock: qty > 0 }),
          });
        })
      );
      setSelectedIds([]);
      await fetchAll();
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    const ok = await ask({
      title: `Delete ${selectedIds.length} product${selectedIds.length > 1 ? "s" : ""}?`,
      description: "Selected products and their reviews will be permanently removed.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    setIsBulkUpdating(true);
    try {
      await Promise.all(selectedIds.map((id) => fetch(`/api/products?id=${id}`, { method: "DELETE" })));
      setSelectedIds([]);
      resetForm();
      setShowForm(false);
      await fetchAll();
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const statusBadge = (status?: string) => {
    const s = status || "approved";
    if (s === "pending") return "bg-amber-50 text-amber-700 ring-amber-600/20";
    if (s === "rejected") return "bg-rose-50 text-rose-700 ring-rose-600/20";
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "out", label: "Out of stock", count: counts.out },
    { key: "reviews", label: "Reviews", count: counts.reviews },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <AdminPageHeader
        pill="ഉൽപ്പന്നങ്ങൾ"
        title="Products"
        subtitle="Manage catalog, pricing, inventory, and review approvals."
        actions={
          <>
            <button
              onClick={fetchAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-[#29425e] bg-white border border-[#29425e]/15 hover:bg-[#29425e]/5 shadow-sm transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all"
            >
              Add product
            </button>
          </>
        }
      />

      {/* Product editor modal — portaled to body so it centers on the full viewport */}
      {portalReady &&
        showForm &&
        createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
          />
          <div className="relative w-full max-w-5xl max-h-[min(92vh,900px)] bg-white rounded-[24px] border border-[#29425e]/10 shadow-[0_24px_60px_rgba(12,22,34,0.18)] overflow-hidden flex flex-col my-auto">
            <div className="shrink-0 px-5 py-4 border-b border-[#29425e]/8 bg-[#F7F9FB] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {editingId ? "Edit product" : "New product"}
                </div>
                <div className="text-lg font-semibold text-[#0c1622] truncate">
                  {form.titleEn || form.title || "Untitled product"}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${
                    form.stock > 0
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      : "bg-amber-50 text-amber-700 ring-amber-600/20"
                  }`}
                >
                  {form.stock > 0 ? `${form.stock} in stock` : "Out of stock"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form id="product-editor-form" onSubmit={handleSave} className="p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
                  <div className="space-y-6">
                    <section className="rounded-2xl border border-[#29425e]/10 p-4 space-y-4">
                      <h3 className="text-sm font-semibold text-[#0c1622]">Title & description</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">Title (Malayalam)</label>
                          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">Title (English)</label>
                          <input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">Short description</label>
                        <input required value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-y`} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">More info</label>
                        <textarea rows={3} value={form.moreInfo} onChange={(e) => setForm({ ...form, moreInfo: e.target.value })} className={`${inputClass} resize-y`} />
                      </div>
                    </section>

                    <section className="rounded-2xl border border-[#29425e]/10 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#0c1622]">Media</h3>
                        <button type="button" onClick={() => { setForm({ ...form, images: [...form.images, ""] }); setUploadFiles([...uploadFiles, null]); }} className="text-sm font-semibold text-[#395c80]">
                          + Add image
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {form.images.map((image, idx) => (
                          <div key={idx} className="rounded-2xl border border-dashed border-[#29425e]/15 p-3 bg-[#F7F9FB] space-y-2">
                            {image && <img src={image} alt="" className="w-full h-28 object-cover rounded-lg border border-gray-100 bg-white" />}
                            <input type="file" accept="image/*" onChange={(e) => { const next = [...uploadFiles]; next[idx] = e.target.files?.[0] || null; setUploadFiles(next); }} className="w-full text-xs" />
                            <input type="text" value={image} onChange={(e) => { const next = [...form.images]; next[idx] = e.target.value; setForm({ ...form, images: next }); }} placeholder="Image URL" className={inputClass} />
                            <button type="button" onClick={() => { setForm({ ...form, images: form.images.length > 1 ? form.images.filter((_, i) => i !== idx) : [""] }); setUploadFiles(uploadFiles.length > 1 ? uploadFiles.filter((_, i) => i !== idx) : []); }} className="text-xs font-semibold text-rose-600">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-2xl border border-[#29425e]/10 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#0c1622]">Features</h3>
                        <button type="button" onClick={() => setForm({ ...form, features: [...form.features, ""] })} className="text-sm font-semibold text-[#395c80]">+ Add</button>
                      </div>
                      {form.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input value={feature} onChange={(e) => { const next = [...form.features]; next[idx] = e.target.value; setForm({ ...form, features: next }); }} className={inputClass} placeholder={`Feature ${idx + 1}`} />
                          <button type="button" onClick={() => setForm({ ...form, features: form.features.length > 1 ? form.features.filter((_, i) => i !== idx) : [""] })} className="px-3 text-sm font-semibold text-rose-600">Remove</button>
                        </div>
                      ))}
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section className="rounded-2xl border border-[#29425e]/10 p-4 space-y-4">
                      <h3 className="text-sm font-semibold text-[#0c1622]">Inventory</h3>
                      <div>
                        <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">Available stock</label>
                        <input
                          required
                          type="number"
                          min={0}
                          value={form.stock}
                          onChange={(e) => {
                            const stock = Math.max(0, Math.floor(Number(e.target.value) || 0));
                            setForm({ ...form, stock, inStock: stock > 0 });
                          }}
                          className={inputClass}
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Set to 0 to mark out of stock. Storefront shows this quantity.
                        </p>
                      </div>
                      <label className="flex items-center justify-between gap-3 cursor-pointer">
                        <span className="text-sm text-gray-700">Product is active / in stock</span>
                        <input
                          type="checkbox"
                          checked={form.stock > 0}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setForm({
                              ...form,
                              inStock: checked,
                              stock: checked ? Math.max(form.stock, 1) : 0,
                            });
                          }}
                          className="w-5 h-5 rounded border-gray-300 text-[#29425e] focus:ring-[#395c80]"
                        />
                      </label>
                      <div>
                        <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">Slug</label>
                        <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="english-companion" className={inputClass} />
                      </div>
                    </section>

                    <section className="rounded-2xl border border-[#29425e]/10 p-4 space-y-3">
                      <div>
                        <h3 className="text-sm font-semibold text-[#0c1622]">SEO (this product only)</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Leave blank to use product name and short description.
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">SEO title</label>
                        <input
                          value={form.seoTitle}
                          onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                          className={inputClass}
                          placeholder="Custom browser / Google title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">SEO description</label>
                        <textarea
                          rows={2}
                          value={form.seoDescription}
                          onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                          className={`${inputClass} resize-y`}
                          placeholder="Meta description for search results"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">SEO keywords</label>
                        <input
                          value={form.seoKeywords}
                          onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                          className={inputClass}
                          placeholder="Comma-separated keywords"
                        />
                      </div>
                    </section>

                    <section className="rounded-2xl border border-[#29425e]/10 p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-[#0c1622]">Pricing</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">Price</label>
                          <input required type="number" min={0} value={form.price} onChange={(e) => updatePriceFields(Number(e.target.value), form.mrp)} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5">Compare-at</label>
                          <input required type="number" min={0} value={form.mrp} onChange={(e) => updatePriceFields(form.price, Number(e.target.value))} className={inputClass} />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">Discount: <span className="font-semibold text-[#0c1622]">{form.discountPercent}%</span></div>
                    </section>

                    <section className="rounded-2xl border border-[#29425e]/10 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#0c1622]">Book details</h3>
                        <button type="button" onClick={() => setForm({ ...form, bookDetails: [...form.bookDetails, { label: "", value: "" }] })} className="text-sm font-semibold text-[#395c80]">+ Add</button>
                      </div>
                      {form.bookDetails.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                          <input value={row.label} onChange={(e) => { const next = [...form.bookDetails]; next[idx] = { ...next[idx], label: e.target.value }; setForm({ ...form, bookDetails: next }); }} placeholder="Label" className={inputClass} />
                          <input value={row.value} onChange={(e) => { const next = [...form.bookDetails]; next[idx] = { ...next[idx], value: e.target.value }; setForm({ ...form, bookDetails: next }); }} placeholder="Value" className={inputClass} />
                          <button type="button" onClick={() => setForm({ ...form, bookDetails: form.bookDetails.length > 1 ? form.bookDetails.filter((_, i) => i !== idx) : [{ label: "", value: "" }] })} className="text-xs font-semibold text-rose-600 px-2">×</button>
                        </div>
                      ))}
                    </section>

                    <section className="rounded-2xl border border-[#29425e]/10 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#0c1622]">Dimensions</h3>
                        <button type="button" onClick={() => setForm({ ...form, dimensions: [...form.dimensions, { label: "", value: "" }] })} className="text-sm font-semibold text-[#395c80]">+ Add</button>
                      </div>
                      {form.dimensions.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                          <input value={row.label} onChange={(e) => { const next = [...form.dimensions]; next[idx] = { ...next[idx], label: e.target.value }; setForm({ ...form, dimensions: next }); }} placeholder="Label" className={inputClass} />
                          <input value={row.value} onChange={(e) => { const next = [...form.dimensions]; next[idx] = { ...next[idx], value: e.target.value }; setForm({ ...form, dimensions: next }); }} placeholder="Value" className={inputClass} />
                          <button type="button" onClick={() => setForm({ ...form, dimensions: form.dimensions.length > 1 ? form.dimensions.filter((_, i) => i !== idx) : [{ label: "", value: "" }] })} className="text-xs font-semibold text-rose-600 px-2">×</button>
                        </div>
                      ))}
                    </section>
                  </div>
                </div>

                {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
              </form>
            </div>

            <div className="shrink-0 flex items-center justify-end gap-2 px-5 py-4 border-t border-[#29425e]/8 bg-white">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-4 py-2.5 rounded-full border border-[#29425e]/12 text-sm font-semibold text-gray-700 hover:bg-[#F7F9FB] transition-colors"
              >
                Discard
              </button>
              <button
                disabled={isSaving}
                type="submit"
                form="product-editor-form"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all disabled:opacity-70"
              >
                {isSaving ? "Saving..." : editingId ? "Save product" : "Create product"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      <div className="bg-white rounded-[24px] border border-[#29425e]/08 shadow-[0_8px_30px_rgba(12,22,34,0.04)] overflow-hidden">
        <div className="px-4 sm:px-5 pt-3 border-b border-[#29425e]/8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3.5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-[#0c1622] text-[#0c1622]"
                    : "border-transparent text-gray-500 hover:text-[#0c1622] hover:bg-[#F7F9FB]"
                }`}
              >
                {t.label}
                <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  tab === t.key ? "bg-[#0c1622]/10 text-[#0c1622]" : "bg-[#29425e]/10 text-[#395c80]"
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {tab !== "reviews" && (
          <div className="p-4 sm:p-5 border-b border-[#29425e]/8 space-y-3">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold ${
                    showFilters ? "border-[#29425e]/30 bg-[#29425e]/5 text-[#29425e]" : "border-[#29425e]/15 bg-white text-[#29425e] hover:bg-[#29425e]/5"
                  }`}
                >
                  Filters
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm font-semibold text-[#29425e] outline-none"
                >
                  <option value="title">Sort: Title</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="stock">Stock status</option>
                </select>
              </div>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-[#F7F9FB] border border-[#29425e]/10 text-sm text-gray-600">
                Use tabs for Active / Out of stock. Search by title, slug, or price.
                <button onClick={() => { setSearch(""); setSort("title"); }} className="font-semibold text-[#395c80]">Clear</button>
              </div>
            )}

            {selectedIds.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[linear-gradient(110deg,#29425e_0%,#0c1622_100%)] text-white">
                <div className="text-sm font-semibold">{selectedIds.length} selected</div>
                <div className="flex flex-wrap gap-2">
                  <button disabled={isBulkUpdating} onClick={() => handleBulkStock(true)} className="px-3 py-2 rounded-lg bg-white text-[#0c1622] text-sm font-bold disabled:opacity-70">
                    Mark active
                  </button>
                  <button disabled={isBulkUpdating} onClick={() => handleBulkStock(false)} className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-bold disabled:opacity-70">
                    Mark out of stock
                  </button>
                  <button disabled={isBulkUpdating} onClick={handleBulkDelete} className="px-3 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold disabled:opacity-70">
                    Delete
                  </button>
                  <button onClick={() => setSelectedIds([])} className="px-3 py-2 text-sm font-semibold text-white/70">Clear</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews tab — all products' reviews with filters */}
        {tab === "reviews" ? (
          <div>
            <div className="p-4 sm:p-5 border-b border-[#29425e]/8 space-y-3">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { key: "all", label: "All", count: reviewCounts.all },
                    { key: "pending", label: "Pending", count: reviewCounts.pending },
                    { key: "approved", label: "Approved", count: reviewCounts.approved },
                    { key: "rejected", label: "Rejected", count: reviewCounts.rejected },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setReviewStatusFilter(f.key)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                      reviewStatusFilter === f.key
                        ? "border-[#0c1622] bg-[#0c1622] text-white"
                        : "border-[#29425e]/15 bg-white text-[#29425e] hover:bg-[#29425e]/5"
                    }`}
                  >
                    {f.label}
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                        reviewStatusFilter === f.key ? "bg-white/20 text-white" : "bg-[#29425e]/10 text-[#395c80]"
                      }`}
                    >
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    placeholder="Search reviews by name, title, content, or product..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowReviewFilters((v) => !v)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold ${
                      showReviewFilters
                        ? "border-[#29425e]/30 bg-[#29425e]/5 text-[#29425e]"
                        : "border-[#29425e]/15 bg-white text-[#29425e] hover:bg-[#29425e]/5"
                    }`}
                  >
                    Filters
                  </button>
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as ReviewSortKey)}
                    className="px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm font-semibold text-[#29425e] outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="rating-high">Rating: high to low</option>
                    <option value="rating-low">Rating: low to high</option>
                  </select>
                </div>
              </div>

              {showReviewFilters && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-[#F7F9FB] border border-[#29425e]/10">
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Product</label>
                    <select
                      value={reviewProductFilter}
                      onChange={(e) => setReviewProductFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm font-semibold text-[#29425e] outline-none"
                    >
                      <option value="all">All products</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.titleEn || p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setReviewStatusFilter("all");
                      setReviewProductFilter("all");
                      setReviewSearch("");
                      setReviewSort("newest");
                    }}
                    className="sm:self-end px-3.5 py-2.5 text-sm font-semibold text-[#395c80]"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {selectedReviewIds.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[linear-gradient(110deg,#29425e_0%,#0c1622_100%)] text-white">
                  <div className="text-sm font-semibold">{selectedReviewIds.length} selected</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={isBulkUpdating}
                      onClick={() => handleBulkReviewStatus("approved")}
                      className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-bold disabled:opacity-70"
                    >
                      Approve
                    </button>
                    <button
                      disabled={isBulkUpdating}
                      onClick={() => handleBulkReviewStatus("rejected")}
                      className="px-3 py-2 rounded-lg bg-amber-400 text-[#0c1622] text-sm font-bold disabled:opacity-70"
                    >
                      Reject
                    </button>
                    <button
                      disabled={isBulkUpdating}
                      onClick={handleBulkDeleteReviews}
                      className="px-3 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold disabled:opacity-70"
                    >
                      Delete
                    </button>
                    <button onClick={() => setSelectedReviewIds([])} className="px-3 py-2 text-sm font-semibold text-white/70">
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-16 text-gray-500">Loading reviews...</div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-16">
                <div className="font-semibold text-[#0c1622]">No reviews found</div>
                <p className="text-sm text-gray-500 mt-1">Try another status, product, or search term.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[920px]">
                  <thead>
                    <tr className="bg-[#F7F9FB] border-b border-[#29425e]/8">
                      <th className="py-3 px-4 w-12">
                        <input
                          type="checkbox"
                          checked={allReviewsSelected}
                          onChange={toggleSelectAllReviews}
                          className="w-4 h-4 rounded border-gray-300 text-[#29425e] focus:ring-[#395c80]"
                        />
                      </th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Review</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredReviews.map((review) => {
                      const product = products.find((p) => p.id === review.productId);
                      const selected = selectedReviewIds.includes(review.id);
                      const status = review.status || "approved";
                      return (
                        <tr
                          key={review.id}
                          className={`transition-colors ${selected ? "bg-[#29425e]/[0.03]" : "hover:bg-gray-50/80"}`}
                        >
                          <td className="py-3.5 px-4 align-top">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleSelectReview(review.id)}
                              className="w-4 h-4 rounded border-gray-300 text-[#29425e] focus:ring-[#395c80]"
                            />
                          </td>
                          <td className="py-3.5 px-4 align-top max-w-[360px]">
                            <div className="font-semibold text-[#0c1622] text-sm">{review.name}</div>
                            <div className="text-sm font-medium text-gray-700 mt-0.5">{review.title}</div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{review.content}</p>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <div className="text-sm font-semibold text-[#395c80] max-w-[180px] truncate">
                              {product?.titleEn || product?.title || review.productId}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <span className="text-sm font-semibold text-[#0c1622]">{review.rating}/5</span>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <span
                              className={`inline-flex px-2 py-1 rounded-md text-[11px] font-semibold ring-1 ring-inset uppercase ${statusBadge(status)}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-top text-sm text-gray-500 whitespace-nowrap">
                            {review.date || "—"}
                          </td>
                          <td className="py-3.5 px-4 align-top text-right">
                            <div className="flex justify-end flex-wrap gap-3">
                              {status !== "approved" && (
                                <button
                                  onClick={() => handleReviewStatus(review.id, "approved")}
                                  className="text-sm font-semibold text-emerald-600 hover:underline"
                                >
                                  Approve
                                </button>
                              )}
                              {status !== "rejected" && (
                                <button
                                  onClick={() => handleReviewStatus(review.id, "rejected")}
                                  className="text-sm font-semibold text-amber-600 hover:underline"
                                >
                                  Reject
                                </button>
                              )}
                              {status !== "pending" && (
                                <button
                                  onClick={() => handleReviewStatus(review.id, "pending")}
                                  className="text-sm font-semibold text-gray-500 hover:underline"
                                >
                                  Pending
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-sm font-semibold text-rose-600 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="text-center py-16 text-gray-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="font-semibold text-[#0c1622]">No products found</div>
            <p className="text-sm text-gray-500 mt-1">Try another tab or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-[#F7F9FB] border-b border-[#29425e]/8">
                  <th className="py-3 px-4 w-12">
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-[#29425e] focus:ring-[#395c80]" />
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inventory</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reviews</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => {
                  const selected = selectedIds.includes(product.id);
                  const pendingForProduct = reviews.filter((r) => r.productId === product.id && r.status === "pending").length;
                  const stockQty = getStockQty(product);
                  const available = stockQty > 0;
                  return (
                    <tr key={product.id} className={`transition-colors ${selected ? "bg-[#29425e]/[0.03]" : "hover:bg-gray-50/80"}`}>
                      <td className="py-3.5 px-4">
                        <input type="checkbox" checked={selected} onChange={() => toggleSelect(product.id)} className="w-4 h-4 rounded border-gray-300 text-[#29425e] focus:ring-[#395c80]" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#29425e]/12 bg-white shrink-0">
                            <img src={product.images?.[0] || "/product.webp"} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <button onClick={() => handleEditClick(product)} className="text-sm font-semibold text-[#395c80] hover:underline truncate block max-w-[260px] text-left">
                              {product.titleEn || product.title}
                            </button>
                            <div className="text-xs text-gray-500 truncate">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleStock(product)}
                          className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${
                            available
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                              : "bg-amber-50 text-amber-700 ring-amber-600/20"
                          }`}
                        >
                          {available ? "Active" : "Out of stock"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            defaultValue={stockQty}
                            key={`${product.id}-${stockQty}`}
                            onBlur={(e) => {
                              const next = Math.max(0, Math.floor(Number(e.target.value) || 0));
                              if (next !== stockQty) updateProductStock(product.id, next);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="w-20 px-2.5 py-1.5 rounded-lg border border-[#29425e]/12 bg-white text-sm font-semibold text-[#0c1622] outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]"
                          />
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {available ? "in stock" : "out of stock"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-sm font-semibold text-[#0c1622]">₹{product.price}</div>
                        <div className="text-xs text-gray-400 line-through">₹{product.mrp}</div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-600">
                        {product.reviewCount || 0}
                        {pendingForProduct > 0 && (
                          <span className="ml-2 text-xs font-semibold text-amber-600">{pendingForProduct} pending</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleEditClick(product)} className="text-sm font-semibold text-[#395c80] hover:underline">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="text-sm font-semibold text-rose-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {confirmDialog}
    </div>
  );
}
