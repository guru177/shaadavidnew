"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type Row = {
  id: string;
  date?: string;
  status?: string;
  paymentStatus?: string;
  amount?: string;
  product?: string;
  carrier?: string;
  awb?: string;
};

export default function OrderHistoryPage() {
  const [mobile, setMobile] = useState("");
  const [orders, setOrders] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch("/api/orders/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setOrders(data.orders || []);
    } catch (err: unknown) {
      setOrders([]);
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F9FB] pt-[120px] pb-20">
        <div className="mx-auto max-w-2xl px-5">
          <h1 className="text-3xl font-semibold text-[#0c1622]">Your orders</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the mobile number used at checkout to see your orders.
          </p>

          <form onSubmit={lookup} className="mt-8 flex gap-2">
            <input
              required
              pattern="[0-9]{10}"
              title="10-digit mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile"
              className="flex-1 rounded-xl border px-4 py-3 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#0c1622] px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "…" : "Find"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

          {searched && !error && orders.length === 0 && (
            <p className="mt-8 text-sm text-gray-500">No orders found for this mobile.</p>
          )}

          <div className="mt-8 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#0c1622]">{o.id}</p>
                    <p className="text-xs text-gray-400">{o.date}</p>
                    <p className="mt-1 text-sm text-gray-600">{o.product}</p>
                    {o.awb && (
                      <p className="mt-1 text-xs text-gray-500">
                        {o.carrier || "Courier"} · AWB {o.awb}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{o.amount}</p>
                    <p className="text-xs text-gray-500">{o.status}</p>
                    <Link
                      href={`/track?order=${encodeURIComponent(o.id)}&mobile=${encodeURIComponent(mobile)}`}
                      className="mt-2 inline-block text-xs font-semibold text-[#29425e] underline"
                    >
                      Track
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
