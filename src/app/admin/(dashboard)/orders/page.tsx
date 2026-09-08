"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { buildWhatsAppNotifyUrl, normalizeOrderStatus, parseOrderDate, type OrderLike } from "@/lib/orders";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import OrderDocumentModal from "@/components/admin/OrderDocumentModal";
import type { OrderDocumentKind } from "@/lib/orderDocuments";

type Order = {
  id: string;
  date: string;
  createdAt?: string;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  amount?: string;
  amountValue?: number;
  product?: string;
  productId?: string;
  whatsappNotified?: boolean;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  screenshotUrl?: string | null;
  carrier?: string;
  awb?: string;
  trackingUrl?: string;
  notes?: string;
  customerDetails?: { name?: string; mobile?: string };
  shippingAddress?: {
    name?: string;
    flat?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    mobile?: string;
  };
};

type TabKey = "all" | "unfulfilled" | "unpaid" | "open" | "closed" | "cancelled" | "refunded";
type SortKey = "newest" | "oldest" | "amount-high" | "amount-low";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Refunded"] as const;
const PAGE_SIZE = 10;

function isPaid(order: Order) {
  return (
    order.paymentStatus === "Paid" ||
    (!!order.razorpayPaymentId && order.paymentStatus !== "Refunded" && order.paymentStatus !== "Unpaid")
  );
}

function isCodOrder(order: Order) {
  return String(order.paymentMethod || "").toUpperCase() === "COD";
}

function paymentMethodLabel(order: Order) {
  if (isCodOrder(order)) return "Cash on delivery";
  if (
    String(order.paymentMethod || "").toLowerCase().includes("razor") ||
    order.razorpayPaymentId ||
    order.razorpayOrderId
  ) {
    return "Online";
  }
  if (order.paymentMethod) return order.paymentMethod;
  return "Online";
}

function isUnfulfilled(order: Order) {
  const s = normalizeOrderStatus(order.status);
  return s === "Pending" || s === "Confirmed";
}

function isOpen(order: Order) {
  const s = normalizeOrderStatus(order.status);
  return s !== "Delivered" && s !== "Cancelled" && s !== "Refunded";
}

function statusStyles(status: string) {
  const s = normalizeOrderStatus(status);
  switch (s) {
    case "Confirmed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "Pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "Shipped":
      return "bg-sky-50 text-sky-700 ring-sky-600/20";
    case "Delivered":
      return "bg-gray-100 text-gray-700 ring-gray-500/20";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 ring-rose-600/20";
    case "Refunded":
      return "bg-violet-50 text-violet-700 ring-violet-600/20";
    default:
      return "bg-gray-50 text-gray-600 ring-gray-500/10";
  }
}

function paymentStyles(paid: boolean) {
  return paid
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
    : "bg-rose-50 text-rose-700 ring-rose-600/20";
}

function parseAmount(order: Order) {
  if (typeof order.amountValue === "number") return order.amountValue;
  const n = parseFloat(String(order.amount || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function AdminOrdersPage() {
  const { settings } = useSiteSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("Shipped");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [whatsappPrompt, setWhatsappPrompt] = useState<OrderLike | null>(null);
  const [whatsappPromptReason, setWhatsappPromptReason] = useState<"paid" | "status">("status");
  const [notifyError, setNotifyError] = useState("");
  const [documentModal, setDocumentModal] = useState<OrderDocumentKind | null>(null);
  const [documentOrders, setDocumentOrders] = useState<Order[]>([]);
  const promptedPaidIds = React.useRef<Set<string>>(new Set());

  const openDocuments = (kind: OrderDocumentKind, list: Order[]) => {
    if (!list.length) return;
    setDocumentOrders(list);
    setDocumentModal(kind);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [tab, search, statusFilter, paymentFilter, methodFilter, sort]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
    setIsLoading(false);
  };

  // Paid orders auto-save as Confirmed — prompt WhatsApp when admin opens Orders
  useEffect(() => {
    if (whatsappPrompt || isLoading) return;
    const pendingNotify = orders.find(
      (o) =>
        o.whatsappNotified === false &&
        !promptedPaidIds.current.has(o.id) &&
        (o.shippingAddress?.mobile || o.customerDetails?.mobile)
    );
    if (!pendingNotify) return;
    promptedPaidIds.current.add(pendingNotify.id);
    setWhatsappPromptReason("paid");
    setWhatsappPrompt(pendingNotify);
  }, [orders, whatsappPrompt, isLoading]);

  const markWhatsAppNotified = async (orderId: string) => {
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, whatsappNotified: true }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, whatsappNotified: true } : o))
      );
      setSelectedOrder((prev) =>
        prev?.id === orderId ? { ...prev, whatsappNotified: true } : prev
      );
    } catch (error) {
      console.error("Failed to mark WhatsApp notified", error);
    }
  };

  const openWhatsAppForOrder = (order: OrderLike) => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : settings.siteUrl;
    const url = buildWhatsAppNotifyUrl(order, { siteUrl, settings });
    if (!url) {
      setNotifyError("No customer mobile number on this order.");
      return;
    }
    setNotifyError("");
    window.open(url, "_blank", "noopener,noreferrer");
    void markWhatsAppNotified(order.id);
  };

  const askWhatsAppNotify = (order: OrderLike, reason: "paid" | "status" = "status") => {
    const mobile = order.shippingAddress?.mobile || order.customerDetails?.mobile;
    if (!mobile) {
      setNotifyError(`No customer mobile on ${order.id}.`);
      return;
    }
    setNotifyError("");
    setWhatsappPromptReason(reason);
    setWhatsappPrompt(order);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const current =
        orders.find((o) => o.id === orderId) ||
        (selectedOrder?.id === orderId ? selectedOrder : null) ||
        { id: orderId };

      const payload: Record<string, string> = { id: orderId, status: newStatus };
      if (newStatus === "Cancelled") payload.action = "cancel";
      if (newStatus === "Refunded") payload.action = "refund";

      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await fetchOrders();
      const updated = { ...current, id: orderId, status: newStatus };
      setSelectedOrder((prev) => (prev?.id === orderId ? { ...prev, status: newStatus } : prev));
      askWhatsAppNotify(updated, "status");
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, paymentStatus }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.error || "Failed to update payment");
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o)));
      setSelectedOrder((prev) => (prev?.id === orderId ? { ...prev, ...updated } : prev));
    } catch (error) {
      console.error("Failed to update payment status", error);
    }
  };

  const counts = useMemo(() => {
    return {
      all: orders.length,
      unfulfilled: orders.filter(isUnfulfilled).length,
      unpaid: orders.filter((o) => !isPaid(o)).length,
      open: orders.filter(isOpen).length,
      closed: orders.filter((o) => normalizeOrderStatus(o.status) === "Delivered").length,
      cancelled: orders.filter((o) => normalizeOrderStatus(o.status) === "Cancelled").length,
      refunded: orders.filter((o) => normalizeOrderStatus(o.status) === "Refunded").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (tab === "unfulfilled") list = list.filter(isUnfulfilled);
    if (tab === "unpaid") list = list.filter((o) => !isPaid(o));
    if (tab === "open") list = list.filter(isOpen);
    if (tab === "closed") list = list.filter((o) => normalizeOrderStatus(o.status) === "Delivered");
    if (tab === "cancelled") list = list.filter((o) => normalizeOrderStatus(o.status) === "Cancelled");
    if (tab === "refunded") list = list.filter((o) => normalizeOrderStatus(o.status) === "Refunded");

    if (statusFilter !== "all") {
      list = list.filter((o) => normalizeOrderStatus(o.status) === statusFilter);
    }

    if (paymentFilter === "paid") list = list.filter(isPaid);
    if (paymentFilter === "unpaid") list = list.filter((o) => !isPaid(o));
    if (methodFilter === "cod") list = list.filter(isCodOrder);
    if (methodFilter === "online") list = list.filter((o) => !isCodOrder(o));

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((o) => {
        const hay = [
          o.id,
          o.product,
          o.customerDetails?.name,
          o.customerDetails?.mobile,
          o.shippingAddress?.city,
          o.shippingAddress?.pincode,
          o.razorpayPaymentId,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    list.sort((a, b) => {
      if (sort === "amount-high") return parseAmount(b) - parseAmount(a);
      if (sort === "amount-low") return parseAmount(a) - parseAmount(b);
      const ta = parseOrderDate((a as Order & { createdAt?: string }).createdAt || a.date);
      const tb = parseOrderDate((b as Order & { createdAt?: string }).createdAt || b.date);
      if (sort === "oldest") return ta - tb;
      return tb - ta;
    });

    return list;
  }, [orders, tab, statusFilter, paymentFilter, methodFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pageOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allPageSelected =
    pageOrders.length > 0 && pageOrders.every((o) => selectedIds.includes(o.id));

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageOrders.some((o) => o.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageOrders.map((o) => o.id)])));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkUpdate = async () => {
    if (!selectedIds.length) return;
    setIsUpdating(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch("/api/orders", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: bulkStatus }),
          })
        )
      );
      setSelectedIds([]);
      await fetchOrders();
    } catch (error) {
      console.error("Bulk update failed", error);
    }
    setIsUpdating(false);
  };

  const exportCsv = () => {
    const rows = [
      [
        "Order ID",
        "Date",
        "Customer",
        "Mobile",
        "Product",
        "Amount",
        "Payment method",
        "Payment",
        "Status",
        "City",
        "PIN",
      ],
      ...filteredOrders.map((o) => [
        o.id,
        o.date,
        o.customerDetails?.name || "",
        o.shippingAddress?.mobile || o.customerDetails?.mobile || "",
        o.product || "",
        o.amount || "",
        paymentMethodLabel(o),
        isPaid(o) ? "Paid" : "Unpaid",
        o.status,
        o.shippingAddress?.city || "",
        o.shippingAddress?.pincode || "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "unfulfilled", label: "Unfulfilled", count: counts.unfulfilled },
    { key: "unpaid", label: "Unpaid", count: counts.unpaid },
    { key: "open", label: "Open", count: counts.open },
    { key: "closed", label: "Closed", count: counts.closed },
    { key: "cancelled", label: "Cancelled", count: counts.cancelled },
    { key: "refunded", label: "Refunded", count: counts.refunded },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#0c1622]">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Search, filter, fulfill, and export customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#0c1622] hover:bg-gray-50 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Export
          </button>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c1622] text-white text-sm font-semibold hover:bg-[#29425e] shadow-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Tabs */}
        <div className="px-4 sm:px-5 pt-3 border-b border-gray-100 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3.5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-[#0c1622] text-[#0c1622]"
                    : "border-transparent text-gray-500 hover:text-[#0c1622] hover:bg-gray-50"
                }`}
              >
                {t.label}
                <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  tab === t.key ? "bg-[#0c1622]/10 text-[#0c1622]" : "bg-gray-100 text-gray-500"
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search + filters toolbar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, customers, phone, payment ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold ${
                  showFilters || statusFilter !== "all" || paymentFilter !== "all" || methodFilter !== "all"
                    ? "border-[#29425e]/30 bg-[#29425e]/5 text-[#29425e]"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" />
                </svg>
                Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amount-high">Amount: high to low</option>
                <option value="amount-low">Amount: low to high</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none min-w-[140px]"
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Payment</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none min-w-[140px]"
                >
                  <option value="all">All payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Method</label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none min-w-[160px]"
                >
                  <option value="all">All methods</option>
                  <option value="online">Online</option>
                  <option value="cod">Cash on delivery</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setPaymentFilter("all");
                    setMethodFilter("all");
                    setSearch("");
                  }}
                  className="px-3 py-2 text-sm font-semibold text-gray-500 hover:text-[#0c1622]"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Bulk actions bar */}
          {selectedIds.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#0c1622] text-white">
              <div className="text-sm font-semibold">
                {selectedIds.length} order{selectedIds.length > 1 ? "s" : ""} selected
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="text-[#0c1622]">{s}</option>
                  ))}
                </select>
                <button
                  disabled={isUpdating}
                  onClick={handleBulkUpdate}
                  className="px-4 py-2 rounded-lg bg-white text-[#0c1622] text-sm font-bold hover:bg-gray-100 disabled:opacity-70"
                >
                  {isUpdating ? "Updating..." : "Update status"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openDocuments(
                      "invoice",
                      orders.filter((o) => selectedIds.includes(o.id))
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/15"
                >
                  Bulk invoices
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openDocuments(
                      "label",
                      orders.filter((o) => selectedIds.includes(o.id))
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/15"
                >
                  Bulk labels
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="px-3 py-2 text-sm font-semibold text-white/70 hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="font-semibold text-[#0c1622]">No orders found</div>
            <p className="text-sm text-gray-500 mt-1">Try changing tabs, search, or filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[960px]">
                <thead>
                  <tr className="bg-[#FAFBFC] border-b border-gray-100">
                    <th className="py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-[#29425e] focus:ring-[#395c80]"
                      />
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Order</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Method</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fulfillment</th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Items</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageOrders.map((order) => {
                    const paid = isPaid(order);
                    const selected = selectedIds.includes(order.id);
                    return (
                      <tr
                        key={order.id}
                        className={`transition-colors ${selected ? "bg-[#29425e]/[0.03]" : "hover:bg-gray-50/80"}`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelect(order.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#29425e] focus:ring-[#395c80]"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-sm font-semibold text-[#2C6ECB] hover:underline"
                          >
                            {order.id}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-sm text-gray-600 whitespace-nowrap">{order.date}</td>
                        <td className="py-3.5 px-4">
                          <div className="text-sm font-semibold text-[#0c1622]">
                            {order.customerDetails?.name || "—"}
                          </div>
                          <div className="text-xs text-gray-500">{order.customerDetails?.mobile}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              isCodOrder(order) ? "text-amber-800" : "text-[#395c80]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isCodOrder(order) ? "bg-amber-500" : "bg-[#395c80]"
                              }`}
                            />
                            {paymentMethodLabel(order)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-sm font-semibold text-[#0c1622]">{order.amount}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${paymentStyles(paid)}`}
                            >
                              {paid ? "Paid" : "Unpaid"}
                            </span>
                            {!paid && (
                              <button
                                type="button"
                                onClick={() => handlePaymentStatusChange(order.id, "Paid")}
                                className="text-[11px] font-semibold text-[#2C6ECB] hover:underline"
                              >
                                Mark paid
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={normalizeOrderStatus(order.status)}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md ring-1 ring-inset outline-none cursor-pointer ${statusStyles(order.status)}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-sm text-gray-700 max-w-[180px] truncate" title={order.product}>
                            {order.product || "1 item"}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-[#FAFBFC]">
              <div className="text-sm text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm font-semibold text-[#0c1622] px-2">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order detail drawer */}
      {selectedOrder &&
        portalReady &&
        createPortal(
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div
            className="absolute inset-0 bg-[#0c1622]/45 backdrop-blur-[2px]"
            onClick={() => {
              setDocumentModal(null);
              setSelectedOrder(null);
            }}
          />
          <div className="relative flex h-full w-full max-w-[26rem] flex-col overflow-hidden bg-[#F7F9FB] shadow-[-24px_0_60px_rgba(12,22,34,0.18)] animate-[modalFadeIn_0.2s_ease-out]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0c1622_0%,#29425e_45%,#395c80_100%)]" />

            <div className="sticky top-0 z-10 border-b border-[#29425e]/10 bg-[linear-gradient(180deg,#ffffff_0%,#F7F9FB_100%)] px-6 pb-5 pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#395c80]">
                    Order details
                  </p>
                  <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#0c1622]">
                    {selectedOrder.id}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">Placed on {selectedOrder.date}</p>
                </div>
                <button
                  onClick={() => {
                    setDocumentModal(null);
                    setSelectedOrder(null);
                  }}
                  className="rounded-full border border-[#29425e]/10 bg-white p-2 text-gray-500 transition hover:border-[#29425e]/25 hover:text-[#0c1622]"
                  aria-label="Close order details"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${
                    isCodOrder(selectedOrder)
                      ? "bg-amber-50 text-amber-800 ring-amber-600/20"
                      : "bg-sky-50 text-sky-800 ring-sky-600/20"
                  }`}
                >
                  {paymentMethodLabel(selectedOrder)}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${paymentStyles(isPaid(selectedOrder))}`}
                >
                  {isPaid(selectedOrder) ? "Paid" : "Unpaid"}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${statusStyles(selectedOrder.status)}`}
                >
                  {normalizeOrderStatus(selectedOrder.status)}
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3 rounded-2xl border border-[#29425e]/10 bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(12,22,34,0.03)]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#395c80]">Total</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-[#0c1622]">
                    {selectedOrder.amount || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Method</p>
                  <p className="mt-1 text-sm font-medium text-[#0c1622]">
                    {paymentMethodLabel(selectedOrder)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <section className="overflow-hidden rounded-2xl border border-[#29425e]/08 bg-white shadow-[0_1px_0_rgba(12,22,34,0.03)]">
                <div className="border-b border-[#29425e]/06 px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#395c80]">Customer</p>
                  <p className="mt-2 text-base font-semibold text-[#0c1622]">
                    {selectedOrder.customerDetails?.name || "—"}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{selectedOrder.customerDetails?.mobile || "—"}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#395c80]">
                    Shipping address
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {[selectedOrder.shippingAddress?.flat, selectedOrder.shippingAddress?.area]
                      .filter(Boolean)
                      .join(", ")}
                    <br />
                    {[selectedOrder.shippingAddress?.city, selectedOrder.shippingAddress?.state]
                      .filter(Boolean)
                      .join(", ")}
                    {selectedOrder.shippingAddress?.pincode ? (
                      <>
                        <br />
                        PIN: {selectedOrder.shippingAddress.pincode}
                      </>
                    ) : null}
                  </p>
                </div>
              </section>

              {(selectedOrder.razorpayPaymentId || selectedOrder.screenshotUrl) && (
                <section className="rounded-2xl border border-[#29425e]/08 bg-white px-5 py-4 shadow-[0_1px_0_rgba(12,22,34,0.03)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#395c80]">Payment</p>
                  {selectedOrder.razorpayPaymentId && (
                    <p className="mt-2 break-all font-mono text-[11px] leading-relaxed text-gray-500">
                      {selectedOrder.razorpayPaymentId}
                    </p>
                  )}
                  {selectedOrder.screenshotUrl && (
                    <button
                      onClick={() => setSelectedScreenshot(selectedOrder.screenshotUrl!)}
                      className="mt-3 text-sm font-semibold text-[#29425e] underline-offset-4 hover:underline"
                    >
                      View payment screenshot
                    </button>
                  )}
                </section>
              )}

              <section className="rounded-2xl border border-[#29425e]/08 bg-white px-5 py-4 shadow-[0_1px_0_rgba(12,22,34,0.03)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#395c80]">Documents</p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => openDocuments("invoice", [selectedOrder])}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0c1622,#29425e)] px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                  >
                    <svg className="h-4 w-4 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => openDocuments("label", [selectedOrder])}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#29425e]/20 bg-[#F7F9FB] px-3 py-3 text-sm font-semibold text-[#0c1622] transition hover:border-[#29425e]/35 hover:bg-white"
                  >
                    <svg className="h-4 w-4 text-[#395c80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Label
                  </button>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
                  Preview in-app, then Print / PDF from the popup.
                </p>
              </section>

              <section className="rounded-2xl border border-[#29425e]/08 bg-white px-5 py-4 shadow-[0_1px_0_rgba(12,22,34,0.03)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#395c80]">Fulfillment</p>
                <p className="mt-2 text-sm font-medium text-[#0c1622]">{selectedOrder.product || "—"}</p>
                <label className="mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  Update status
                </label>
                <select
                  value={normalizeOrderStatus(selectedOrder.status)}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] px-3 py-2.5 text-sm font-semibold text-[#0c1622] outline-none transition focus:border-[#29425e]/30 focus:ring-2 focus:ring-[#395c80]/15"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <label className="mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  Payment status
                </label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <select
                    value={
                      selectedOrder.paymentStatus === "Refunded"
                        ? "Refunded"
                        : isPaid(selectedOrder)
                          ? "Paid"
                          : "Unpaid"
                    }
                    onChange={(e) => handlePaymentStatusChange(selectedOrder.id, e.target.value)}
                    className="flex-1 min-w-[8rem] rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] px-3 py-2.5 text-sm font-semibold text-[#0c1622] outline-none transition focus:border-[#29425e]/30 focus:ring-2 focus:ring-[#395c80]/15"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                  {!isPaid(selectedOrder) && selectedOrder.paymentStatus !== "Refunded" && (
                    <button
                      type="button"
                      onClick={() => handlePaymentStatusChange(selectedOrder.id, "Paid")}
                      className="rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Mark paid
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
                  Unpaid orders (including COD) can still be Confirmed, Shipped, or Delivered. Mark paid when
                  cash or online payment is collected.
                </p>

                <div className="mt-4 grid gap-2">
                  <input
                    placeholder="Carrier (e.g. India Post)"
                    defaultValue={selectedOrder.carrier || ""}
                    id="order-carrier"
                    className="rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="AWB / tracking number"
                    defaultValue={selectedOrder.awb || ""}
                    id="order-awb"
                    className="rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Tracking URL (optional)"
                    defaultValue={selectedOrder.trackingUrl || ""}
                    id="order-tracking-url"
                    className="rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    className="rounded-xl border border-[#29425e]/20 px-3 py-2 text-sm font-semibold text-[#0c1622] hover:bg-white"
                    onClick={async () => {
                      const carrier = (document.getElementById("order-carrier") as HTMLInputElement)?.value || "";
                      const awb = (document.getElementById("order-awb") as HTMLInputElement)?.value || "";
                      const trackingUrl =
                        (document.getElementById("order-tracking-url") as HTMLInputElement)?.value || "";
                      const res = await fetch("/api/orders", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: selectedOrder.id, carrier, awb, trackingUrl }),
                      });
                      const updated = await res.json();
                      if (res.ok) {
                        setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
                        setSelectedOrder((prev) => (prev ? { ...prev, ...updated } : prev));
                      }
                    }}
                  >
                    Save shipping details
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800"
                    onClick={() => handleStatusChange(selectedOrder.id, "Cancelled")}
                  >
                    Cancel + restock
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900"
                    onClick={() => handleStatusChange(selectedOrder.id, "Refunded")}
                  >
                    Refund + restock
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => openWhatsAppForOrder(selectedOrder)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600/20 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.026c0 2.12.554 4.189 1.602 6.006L0 24l6.135-1.61a11.803 11.803 0 005.911 1.586h.005c6.634 0 12.032-5.396 12.034-12.028a11.794 11.794 0 00-3.417-8.467z" />
                  </svg>
                  Notify on WhatsApp
                </button>
                <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
                  Opens WhatsApp with order status and track link for the customer.
                </p>
              </section>
            </div>
          </div>
        </div>,
        document.body
      )}
      {whatsappPrompt &&
        portalReady &&
        createPortal(
          <div className="fixed inset-0 z-[230] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
              onClick={() => {
                void markWhatsAppNotified(whatsappPrompt.id);
                setWhatsappPrompt(null);
              }}
            />
            <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-[#FAFBFC]">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">WhatsApp notify</div>
                <div className="text-lg font-semibold text-[#0c1622] mt-0.5">
                  {whatsappPromptReason === "paid" ? "New paid order confirmed" : "Send status update?"}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {whatsappPromptReason === "paid" ? (
                    <>
                      Payment received for{" "}
                      <span className="font-semibold text-[#0c1622]">{whatsappPrompt.id}</span>. Order is
                      saved as{" "}
                      <span className="font-semibold text-[#0c1622]">Confirmed</span>. Notify the
                      customer on WhatsApp?
                    </>
                  ) : (
                    <>
                      Notify customer about order{" "}
                      <span className="font-semibold text-[#0c1622]">{whatsappPrompt.id}</span> status{" "}
                      <span className="font-semibold text-[#0c1622]">
                        &quot;{normalizeOrderStatus(whatsappPrompt.status)}&quot;
                      </span>{" "}
                      on WhatsApp?
                    </>
                  )}
                </p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm space-y-1">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Customer</span>
                    <span className="font-semibold text-[#0c1622] text-right">
                      {whatsappPrompt.shippingAddress?.name ||
                        whatsappPrompt.customerDetails?.name ||
                        "—"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-semibold text-[#0c1622]">
                      {whatsappPrompt.shippingAddress?.mobile ||
                        whatsappPrompt.customerDetails?.mobile ||
                        "—"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Status</span>
                    <span className="font-semibold text-[#0c1622]">
                      {normalizeOrderStatus(whatsappPrompt.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setWhatsappPrompt(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openWhatsAppForOrder(whatsappPrompt);
                      setWhatsappPrompt(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                  >
                    Open WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {notifyError && (
        <div className="fixed bottom-6 right-6 z-[90] max-w-sm bg-[#0c1622] text-white px-4 py-3 rounded-xl shadow-xl flex items-start gap-3">
          <p className="text-sm font-medium flex-1">{notifyError}</p>
          <button
            type="button"
            onClick={() => setNotifyError("")}
            className="text-white/70 hover:text-white text-sm font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {documentModal && documentOrders.length > 0 && (
        <OrderDocumentModal
          open
          kind={documentModal}
          orders={documentOrders}
          options={{
            siteName: settings.siteName,
            logoUrl:
              typeof window !== "undefined"
                ? `${window.location.origin}/logo.png`
                : "/logo.png",
            tagline:
              settings.tagline ||
              "മലയാളത്തിലൂടെ ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് പഠിക്കാം",
            supportEmail: settings.contact.email,
            supportPhone: settings.contact.phone,
            siteUrl:
              typeof window !== "undefined"
                ? window.location.origin
                : settings.siteUrl || "http://localhost:3000",
          }}
          onClose={() => {
            setDocumentModal(null);
            setDocumentOrders([]);
          }}
        />
      )}

      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-white rounded-xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedScreenshot}
              alt="Payment Screenshot"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
