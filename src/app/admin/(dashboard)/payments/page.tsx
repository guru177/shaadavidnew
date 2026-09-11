"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminEmpty,
  adminSearchInput,
  adminSelect,
  adminStatChip,
} from "@/components/admin/adminStyles";
import type { PaymentSummary, PaymentTransaction } from "@/types/payments";

type TabKey = "all" | "captured" | "refunded" | "unpaid" | "failed";
type DateMode = "all" | "month" | "range";

function formatMoney(n: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n || 0);
  } catch {
    return `₹${(n || 0).toFixed(2)}`;
  }
}

function formatWhen(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseTxDate(tx: PaymentTransaction): Date | null {
  const raw = tx.createdAt || tx.date || "";
  if (!raw) return null;
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d;
  // Fallback for "10 Sep 2026, 04:13 pm" style dates
  const loose = Date.parse(raw.replace(/,/g, ""));
  if (!Number.isNaN(loose)) return new Date(loose);
  return null;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function toInputDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toMonthValue(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
}

function summarizeFiltered(rows: PaymentTransaction[]): PaymentSummary {
  let capturedCount = 0;
  let refundedCount = 0;
  let unpaidCount = 0;
  let capturedAmount = 0;
  let refundedAmount = 0;
  for (const r of rows) {
    if (r.status === "captured" || r.status === "authorized") {
      capturedCount += 1;
      capturedAmount += r.amount;
    }
    if (r.status === "refunded" || r.status === "partial_refund") {
      refundedCount += 1;
      refundedAmount += r.refundAmount ?? (r.status === "refunded" ? r.amount : 0);
    }
    if (r.status === "unpaid" || r.status === "pending") unpaidCount += 1;
  }
  return {
    totalCount: rows.length,
    capturedCount,
    refundedCount,
    unpaidCount,
    capturedAmount,
    refundedAmount,
  };
}

function statusBadge(status: PaymentTransaction["status"]) {
  const map: Record<PaymentTransaction["status"], string> = {
    captured: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    authorized: "bg-sky-50 text-sky-700 ring-sky-600/20",
    refunded: "bg-violet-50 text-violet-700 ring-violet-600/20",
    partial_refund: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    unpaid: "bg-rose-50 text-rose-700 ring-rose-600/20",
    failed: "bg-rose-50 text-rose-800 ring-rose-600/25",
  };
  const label =
    status === "partial_refund"
      ? "Partial refund"
      : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${map[status]}`}
    >
      {label}
    </span>
  );
}

export default function AdminPaymentsPage() {
  const { ask, dialog: confirmDialog } = useAdminConfirm();
  const [rows, setRows] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateMode, setDateMode] = useState<DateMode>("all");
  const [monthValue, setMonthValue] = useState(() => toMonthValue(new Date()));
  const [dateFrom, setDateFrom] = useState(() => toInputDate(new Date()));
  const [dateTo, setDateTo] = useState(() => toInputDate(new Date()));
  const [datePreset, setDatePreset] = useState<"all" | "today" | "week" | "month" | "lastMonth" | "custom">("all");
  const [selected, setSelected] = useState<PaymentTransaction | null>(null);
  const [busy, setBusy] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments?enrich=1");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setRows(Array.isArray(data.transactions) ? data.transactions : []);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : "Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const methods = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.method) set.add(r.method);
    });
    return Array.from(set).sort();
  }, [rows]);

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      const d = parseTxDate(r);
      if (d) set.add(toMonthValue(d));
    });
    return Array.from(set).sort().reverse();
  }, [rows]);

  const inDateFilter = useCallback(
    (tx: PaymentTransaction) => {
      if (dateMode === "all") return true;
      const d = parseTxDate(tx);
      if (!d) return false;

      if (dateMode === "month") {
        return toMonthValue(d) === monthValue;
      }

      // range
      if (!dateFrom && !dateTo) return true;
      const t = d.getTime();
      if (dateFrom) {
        const from = startOfDay(new Date(`${dateFrom}T00:00:00`)).getTime();
        if (t < from) return false;
      }
      if (dateTo) {
        const to = endOfDay(new Date(`${dateTo}T00:00:00`)).getTime();
        if (t > to) return false;
      }
      return true;
    },
    [dateMode, monthValue, dateFrom, dateTo]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (!inDateFilter(r)) return false;
      if (tab === "captured" && !(r.status === "captured" || r.status === "authorized")) return false;
      if (tab === "refunded" && !(r.status === "refunded" || r.status === "partial_refund")) return false;
      if (tab === "unpaid" && !(r.status === "unpaid" || r.status === "pending")) return false;
      if (tab === "failed" && r.status !== "failed") return false;
      if (methodFilter !== "all" && r.method !== methodFilter) return false;
      if (!q) return true;
      return (
        r.orderId.toLowerCase().includes(q) ||
        (r.razorpayPaymentId || "").toLowerCase().includes(q) ||
        (r.razorpayOrderId || "").toLowerCase().includes(q) ||
        (r.refundId || "").toLowerCase().includes(q) ||
        (r.customerName || "").toLowerCase().includes(q) ||
        (r.customerMobile || "").toLowerCase().includes(q) ||
        (r.customerEmail || "").toLowerCase().includes(q) ||
        (r.product || "").toLowerCase().includes(q) ||
        (r.method || "").toLowerCase().includes(q)
      );
    });
  }, [rows, tab, methodFilter, query, inDateFilter]);

  const displaySummary = useMemo(() => summarizeFiltered(filtered), [filtered]);

  const applyPreset = (preset: "today" | "week" | "month" | "lastMonth" | "all") => {
    const now = new Date();
    setDatePreset(preset);
    if (preset === "all") {
      setDateMode("all");
      return;
    }
    if (preset === "month") {
      setDateMode("month");
      setMonthValue(toMonthValue(now));
      return;
    }
    if (preset === "lastMonth") {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      setDateMode("month");
      setMonthValue(toMonthValue(last));
      return;
    }
    setDateMode("range");
    if (preset === "today") {
      const t = toInputDate(now);
      setDateFrom(t);
      setDateTo(t);
      return;
    }
    const from = new Date(now);
    from.setDate(from.getDate() - 6);
    setDateFrom(toInputDate(from));
    setDateTo(toInputDate(now));
  };

  const refundPayment = async (tx: PaymentTransaction) => {
    const ok = await ask({
      title: "Refund this payment?",
      description: `Refund ${formatMoney(tx.amount, tx.currency)} for order ${tx.orderId}? This will restock items and attempt a Razorpay refund when a payment ID exists.`,
      confirmLabel: "Refund",
      danger: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refund", orderId: tx.orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refund failed");
      await load();
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refund failed");
    } finally {
      setBusy(false);
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "captured", label: "Captured" },
    { key: "refunded", label: "Refunded" },
    { key: "unpaid", label: "Unpaid / Pending" },
    { key: "failed", label: "Failed" },
  ];

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {confirmDialog}
      <AdminPageHeader
        pill="പേയ്‌മെന്റുകൾ"
        title="Payments"
        subtitle="All transactions with Razorpay payment IDs, refunds, method details, and customer info — similar to the Razorpay dashboard."
        actions={
          <button type="button" onClick={load} disabled={isLoading} className={adminBtnGhost}>
            {isLoading ? "Refreshing…" : "Refresh"}
          </button>
        }
      />

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={adminStatChip}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#395c80]">Transactions</p>
          <p className="mt-1 text-2xl font-bold text-[#0c1622]">{displaySummary.totalCount}</p>
          {dateMode !== "all" && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              {dateMode === "month" ? monthLabel(monthValue) : "In selected dates"}
            </p>
          )}
        </div>
        <div className={adminStatChip}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Captured</p>
          <p className="mt-1 text-2xl font-bold text-[#0c1622]">
            {formatMoney(displaySummary.capturedAmount)}
          </p>
          <p className="text-xs text-gray-500">{displaySummary.capturedCount} payments</p>
        </div>
        <div className={adminStatChip}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">Refunded</p>
          <p className="mt-1 text-2xl font-bold text-[#0c1622]">
            {formatMoney(displaySummary.refundedAmount)}
          </p>
          <p className="text-xs text-gray-500">{displaySummary.refundedCount} refunds</p>
        </div>
        <div className={adminStatChip}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Unpaid / Pending</p>
          <p className="mt-1 text-2xl font-bold text-[#0c1622]">{displaySummary.unpaidCount}</p>
        </div>
      </div>

      <div className={`${adminCard} overflow-hidden`}>
        <div className="px-4 sm:px-5 pt-3 border-b border-[#29425e]/8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-[#0c1622] text-[#0c1622]"
                    : "border-transparent text-gray-500 hover:text-[#29425e]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3 border-b border-[#29425e]/06">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All time"],
                ["today", "Today"],
                ["week", "Last 7 days"],
                ["month", "This month"],
                ["lastMonth", "Last month"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  datePreset === key
                    ? "bg-[#0c1622] text-white border-[#0c1622]"
                    : "bg-white text-[#29425e] border-[#29425e]/15 hover:bg-[#29425e]/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
            <div className="min-w-[160px]">
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#395c80] mb-1.5">
                Filter by
              </label>
              <select
                className={adminSelect + " w-full"}
                value={dateMode}
                onChange={(e) => {
                  const mode = e.target.value as DateMode;
                  setDateMode(mode);
                  setDatePreset("custom");
                }}
              >
                <option value="all">All dates</option>
                <option value="month">Month wise</option>
                <option value="range">Date wise (range)</option>
              </select>
            </div>

            {dateMode === "month" && (
              <div className="min-w-[200px]">
                <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#395c80] mb-1.5">
                  Month
                </label>
                <input
                  type="month"
                  className={adminSelect + " w-full"}
                  value={monthValue}
                  onChange={(e) => {
                    setMonthValue(e.target.value);
                    setDatePreset("custom");
                  }}
                  list="payment-months"
                />
                <datalist id="payment-months">
                  {availableMonths.map((m) => (
                    <option key={m} value={m} label={monthLabel(m)} />
                  ))}
                </datalist>
              </div>
            )}

            {dateMode === "range" && (
              <>
                <div className="min-w-[160px]">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#395c80] mb-1.5">
                    From date
                  </label>
                  <input
                    type="date"
                    className={adminSelect + " w-full"}
                    value={dateFrom}
                    max={dateTo || undefined}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setDatePreset("custom");
                    }}
                  />
                </div>
                <div className="min-w-[160px]">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#395c80] mb-1.5">
                    To date
                  </label>
                  <input
                    type="date"
                    className={adminSelect + " w-full"}
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setDatePreset("custom");
                    }}
                  />
                </div>
              </>
            )}

            <div className="relative flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#395c80] mb-1.5">
                Search
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className={adminSearchInput}
                  placeholder="Payment id, order id, refund id, customer…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="min-w-[140px]">
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#395c80] mb-1.5">
                Method
              </label>
              <select
                className={adminSelect + " w-full"}
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="all">All methods</option>
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="px-5 pb-8 text-center text-gray-500 text-sm">Loading payments…</div>
        ) : filtered.length === 0 ? (
          <div className={`${adminEmpty} mx-4 mb-4`}>
            <p className="text-sm font-semibold text-[#0c1622]">No payments found</p>
            <p className="text-sm text-gray-500 mt-1">Orders with Razorpay / COD payments will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[960px]">
              <thead className="bg-[#F7F9FB] text-[10px] font-bold uppercase tracking-[0.14em] text-[#395c80]">
                <tr>
                  <th className="px-5 py-3">Payment ID</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Refund</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29425e]/06">
                {filtered.map((tx) => (
                  <tr key={`${tx.orderId}-${tx.id}`} className="hover:bg-[#F7F9FB]/70">
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => setSelected(tx)}
                        className="font-mono text-xs text-[#395c80] hover:underline break-all text-left"
                      >
                        {tx.razorpayPaymentId || tx.id}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/orders?q=${encodeURIComponent(tx.orderId)}`} className="font-semibold text-[#0c1622] hover:text-[#395c80]">
                        {tx.orderId}
                      </Link>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[140px]">{tx.product || "—"}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[#0c1622]">{tx.customerName || "—"}</p>
                      <p className="text-xs text-gray-500">{tx.customerMobile || tx.customerEmail || ""}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[#0c1622]">{tx.methodDetail || tx.method}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#0c1622]">
                      {formatMoney(tx.amount, tx.currency)}
                    </td>
                    <td className="px-4 py-3.5">{statusBadge(tx.status)}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-600">
                      {tx.refundId || tx.refundAmount != null ? (
                        <>
                          <p className="font-mono text-[11px] text-violet-700 break-all">{tx.refundId || "—"}</p>
                          <p>{tx.refundAmount != null ? formatMoney(tx.refundAmount, tx.currency) : ""}</p>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {formatWhen(tx.createdAt || tx.date || "")}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-2">
                        <button type="button" className={adminBtnSecondary + " !px-3 !py-1.5 !text-xs"} onClick={() => setSelected(tx)}>
                          View
                        </button>
                        {(tx.status === "captured" || tx.status === "authorized" || tx.paymentStatus === "Paid") && (
                          <button
                            type="button"
                            disabled={busy}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 disabled:opacity-50"
                            onClick={() => refundPayment(tx)}
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {portalReady &&
        selected &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex justify-end">
            <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={() => setSelected(null)} />
            <div className="relative h-full w-full max-w-[28rem] bg-[#F7F9FB] shadow-[-24px_0_60px_rgba(12,22,34,0.18)] flex flex-col overflow-hidden animate-[modalFadeIn_0.2s_ease-out]">
              <div className="shrink-0 px-5 py-4 border-b border-[#29425e]/10 bg-white flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#395c80]">Payment details</p>
                  <h2 className="mt-1 font-mono text-sm font-bold text-[#0c1622] break-all">
                    {selected.razorpayPaymentId || selected.id}
                  </h2>
                  <div className="mt-2">{statusBadge(selected.status)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#0c1622]"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <section className="rounded-2xl border border-[#29425e]/08 bg-white p-4 space-y-3">
                  <Row label="Amount" value={formatMoney(selected.amount, selected.currency)} strong />
                  <Row label="Order ID" value={selected.orderId} copyable onCopy={copyText} />
                  <Row label="Order status" value={selected.orderStatus} />
                  <Row label="Payment status" value={selected.paymentStatus} />
                  <Row label="Method" value={selected.methodDetail || selected.method} />
                  <Row label="Created" value={formatWhen(selected.createdAt || selected.date || "")} />
                  {selected.razorpayOrderId && (
                    <Row label="Razorpay order" value={selected.razorpayOrderId} copyable onCopy={copyText} />
                  )}
                  {selected.razorpayPaymentId && (
                    <Row label="Razorpay payment" value={selected.razorpayPaymentId} copyable onCopy={copyText} />
                  )}
                </section>

                <section className="rounded-2xl border border-[#29425e]/08 bg-white p-4 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#395c80]">Customer</p>
                  <Row label="Name" value={selected.customerName || "—"} />
                  <Row label="Mobile" value={selected.customerMobile || "—"} />
                  <Row label="Email" value={selected.customerEmail || "—"} />
                  <Row label="Product" value={selected.product || "—"} />
                </section>

                <section className="rounded-2xl border border-[#29425e]/08 bg-white p-4 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#395c80]">Refund</p>
                  <Row label="Refund ID" value={selected.refundId || "—"} copyable={Boolean(selected.refundId)} onCopy={copyText} />
                  <Row
                    label="Refund amount"
                    value={
                      selected.refundAmount != null
                        ? formatMoney(selected.refundAmount, selected.currency)
                        : "—"
                    }
                  />
                  <Row label="Refund status" value={selected.refundStatus || "—"} />
                  <Row label="Refunded at" value={formatWhen(selected.refundedAt || "")} />
                  {selected.refundError && (
                    <p className="text-xs text-rose-600 bg-rose-50 rounded-xl px-3 py-2">{selected.refundError}</p>
                  )}
                </section>

                {selected.gateway && (
                  <section className="rounded-2xl border border-[#29425e]/08 bg-white p-4 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#395c80]">
                      Gateway (Razorpay)
                    </p>
                    <Row
                      label="Fee"
                      value={selected.gateway.fee != null ? formatMoney(selected.gateway.fee) : "—"}
                    />
                    <Row
                      label="Tax"
                      value={selected.gateway.tax != null ? formatMoney(selected.gateway.tax) : "—"}
                    />
                    <Row label="Bank" value={selected.gateway.bank || "—"} />
                    <Row label="VPA" value={selected.gateway.vpa || "—"} />
                    <Row
                      label="Card"
                      value={
                        selected.gateway.cardLast4
                          ? `${selected.gateway.cardNetwork || "Card"} ·••• ${selected.gateway.cardLast4}`
                          : "—"
                      }
                    />
                    <Row
                      label="Amount refunded (gateway)"
                      value={
                        selected.gateway.amountRefunded != null
                          ? formatMoney(selected.gateway.amountRefunded)
                          : "—"
                      }
                    />
                    {selected.gateway.errorDescription && (
                      <p className="text-xs text-rose-600">
                        {selected.gateway.errorCode}: {selected.gateway.errorDescription}
                      </p>
                    )}
                  </section>
                )}

                {selected.screenshotUrl && (
                  <section className="rounded-2xl border border-[#29425e]/08 bg-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#395c80] mb-2">
                      Payment screenshot
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selected.screenshotUrl} alt="Payment proof" className="w-full rounded-xl border border-gray-100" />
                  </section>
                )}
              </div>

              <div className="shrink-0 p-4 border-t border-[#29425e]/10 bg-white flex flex-wrap gap-2">
                <Link
                  href={`/admin/orders?q=${encodeURIComponent(selected.orderId)}`}
                  className={adminBtnGhost}
                >
                  Open order
                </Link>
                {(selected.status === "captured" ||
                  selected.status === "authorized" ||
                  selected.paymentStatus === "Paid") && (
                  <button
                    type="button"
                    disabled={busy}
                    className={adminBtnPrimary}
                    onClick={() => refundPayment(selected)}
                  >
                    {busy ? "Refunding…" : "Refund payment"}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  copyable,
  onCopy,
}: {
  label: string;
  value: string;
  strong?: boolean;
  copyable?: boolean;
  onCopy?: (v: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-right break-all ${strong ? "font-bold text-[#0c1622] text-base" : "font-medium text-[#0c1622]"}`}>
        {copyable && value && value !== "—" ? (
          <button type="button" onClick={() => onCopy?.(value)} className="hover:text-[#395c80] text-left" title="Copy">
            {value}
          </button>
        ) : (
          value
        )}
      </span>
    </div>
  );
}
