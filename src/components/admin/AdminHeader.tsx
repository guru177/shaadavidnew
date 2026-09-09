"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminNav } from "@/components/admin/AdminShell";

type NotifyOrder = {
  id?: string;
  date?: string;
  status?: string;
  customerDetails?: { name?: string };
  shippingAddress?: { name?: string };
};

export default function AdminHeader() {
  const [notifications, setNotifications] = useState<NotifyOrder[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toggle } = useAdminNav();

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const pending = data.filter((o: NotifyOrder) => o.status === "Pending");
        setNotifications(pending);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <header className="h-16 sm:h-20 shrink-0 relative z-10 flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 bg-white/80 backdrop-blur-xl border-b border-[#29425e]/10 shadow-[0_1px_0_rgba(12,22,34,0.03)]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggle}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#29425e]/8 text-[#29425e] hover:bg-[#29425e]/15 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#395c80]">
            Shaa David&apos;s Academy
          </p>
          <p className="truncate text-sm font-medium text-[#0c1622]/70">
            Manage store, content, and orders
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full text-[#29425e] bg-[#29425e]/8 hover:bg-[#29425e]/15 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#c4a35a] border-2 border-white rounded-full animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(12,22,34,0.14)] border border-[#29425e]/10 overflow-hidden z-50">
              <div className="p-4 border-b border-[#29425e]/8 flex justify-between items-center bg-[linear-gradient(180deg,#ffffff_0%,#F7F9FB_100%)]">
                <h3 className="font-bold text-[#0c1622] text-sm">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="text-xs font-bold bg-[#395c80]/10 text-[#29425e] px-2.5 py-0.5 rounded-full">
                    {notifications.length} New
                  </span>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-[#29425e]/5 rounded-full flex items-center justify-center mb-3 text-[#395c80]">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#0c1622] mb-1">You&apos;re all caught up!</p>
                    <p className="text-xs text-gray-500">No new notifications right now.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#29425e]/6">
                    {notifications.map((n, idx) => (
                      <Link
                        key={n.id || idx}
                        href="/admin/orders"
                        onClick={() => setShowNotifications(false)}
                        className="p-4 flex gap-3 hover:bg-[#F7F9FB] transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#395c80]/10 text-[#395c80] flex items-center justify-center shrink-0 mt-0.5 border border-[#395c80]/15">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0c1622] mb-1">Pending order</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            <span className="font-bold text-[#0c1622]">
                              {n.customerDetails?.name || n.shippingAddress?.name || "A customer"}
                            </span>{" "}
                            placed an order that needs attention.
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium">{n.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-[#29425e]/8 text-center bg-[#F7F9FB]">
                <Link
                  href="/admin/orders"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#395c80] hover:text-[#29425e] transition-colors inline-flex items-center gap-1"
                >
                  Manage Orders
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-[#29425e]/12">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-[#0c1622]">Admin</div>
            <div className="text-xs font-medium text-[#395c80]">Shaa David&apos;s Academy</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#29425e,#395c80)] flex items-center justify-center text-white font-bold shadow-[0_8px_20px_rgba(41,66,94,0.28)]">
            SD
          </div>
        </div>
      </div>
    </header>
  );
}
