"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminCard,
  adminEmpty,
  adminModal,
  adminSearchInput,
} from "@/components/admin/adminStyles";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
};

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

export default function AdminContactsPage() {
  const { ask, dialog: confirmDialog } = useAdminConfirm();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
    );
  }, [messages, query]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    if (msg.read) return;
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, read: true }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, ...updated } : m)));
      setSelected((prev) => (prev?.id === msg.id ? { ...prev, read: true } : prev));
    } catch {
      /* non-blocking */
    }
  };

  const deleteMessage = async (id: string) => {
    const target = messages.find((m) => m.id === id);
    const ok = await ask({
      title: "Delete this message?",
      description: (
        <>
          <span className="font-medium text-gray-700">{target?.subject || "This message"}</span> from{" "}
          <span className="font-medium text-gray-700">{target?.name || "the sender"}</span> will be
          permanently removed.
        </>
      ),
      confirmLabel: "Delete message",
    });
    if (!ok) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        await ask({
          title: "Could not delete",
          description: "Failed to delete this message. Please try again.",
          confirmLabel: "OK",
          cancelLabel: "Close",
          danger: false,
        });
        return;
      }
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelected(null);
    } catch {
      await ask({
        title: "Could not delete",
        description: "Failed to delete this message. Please try again.",
        confirmLabel: "OK",
        cancelLabel: "Close",
        danger: false,
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <AdminPageHeader
        pill="സന്ദേശങ്ങൾ"
        title="Contact messages"
        subtitle="Messages submitted from the public contact form."
        actions={
          <button type="button" onClick={load} className={adminBtnGhost}>
            Refresh
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            className={adminSearchInput}
            placeholder="Search name, email, subject…"
          />
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#29425e]/10 text-[#29425e]">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className={`${adminCard} overflow-hidden`}>
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Loading messages…</div>
        ) : filtered.length === 0 ? (
          <div className={`${adminEmpty} !border-0 !rounded-none`}>
            <p className="font-semibold text-[#0c1622]">No messages yet</p>
            <p className="text-sm text-gray-500 mt-1">Submissions from /contact will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-[#29425e]/08 bg-[#F7F9FB] text-[10px] font-bold uppercase tracking-wider text-[#395c80]/80">
                  <th className="px-4 py-3 w-8" />
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29425e]/08">
                {filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-[#F7F9FB]/80 transition-colors ${
                      msg.read ? "" : "bg-[#395c80]/[0.03]"
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      {!msg.read ? (
                        <span className="block w-2 h-2 rounded-full bg-[#395c80]" title="Unread" />
                      ) : (
                        <span className="block w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-sm ${
                          msg.read ? "font-medium text-gray-700" : "font-bold text-[#0c1622]"
                        }`}
                      >
                        {msg.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 truncate max-w-[200px]">
                      {msg.email}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#0c1622] truncate max-w-[260px]">
                      {msg.subject}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                      {formatWhen(msg.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => openMessage(msg)}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-sm hover:brightness-110"
                      >
                        View
                      </button>
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
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c1622]/55 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`${adminModal} w-full max-w-lg p-6 sm:p-7`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#395c80] mb-1">
                    Contact message
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0c1622] font-malayalam-display leading-snug">
                    {selected.subject}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{formatWhen(selected.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="shrink-0 w-9 h-9 rounded-full border border-[#29425e]/12 text-gray-500 hover:bg-[#F7F9FB] flex items-center justify-center"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="rounded-2xl bg-[#F7F9FB] border border-[#29425e]/08 px-4 py-3 space-y-1 mb-5">
                <p className="text-sm font-semibold text-[#0c1622]">{selected.name}</p>
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                  className="text-sm font-medium text-[#395c80] hover:underline break-all"
                >
                  {selected.email}
                </a>
              </div>

              <p className="text-[15px] text-[#0c1622] whitespace-pre-wrap leading-relaxed mb-6 max-h-[40vh] overflow-y-auto">
                {selected.message}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                  className={adminBtnPrimary}
                >
                  Reply by email
                </a>
                <button
                  type="button"
                  disabled={busyId === selected.id}
                  onClick={() => deleteMessage(selected.id)}
                  className="px-4 py-2.5 rounded-full text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-70"
                >
                  {busyId === selected.id ? "Deleting…" : "Delete"}
                </button>
                <button type="button" onClick={() => setSelected(null)} className={adminBtnGhost}>
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {confirmDialog}
    </div>
  );
}
