"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminCard,
  adminEmpty,
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
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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
    if (!window.confirm("Delete this contact message permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete message.");
        return;
      }
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelected((prev) => (prev?.id === id ? null : prev));
    } catch {
      alert("Failed to delete message.");
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className={`lg:col-span-2 ${adminCard} overflow-hidden`}>
          {isLoading ? (
            <div className="py-16 text-center text-gray-500 text-sm">Loading messages…</div>
          ) : filtered.length === 0 ? (
            <div className={`${adminEmpty} !border-0 !rounded-none`}>
              <p className="font-semibold text-[#0c1622]">No messages yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Submissions from /contact will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#29425e]/08 max-h-[70vh] overflow-y-auto">
              {filtered.map((msg) => {
                const active = selected?.id === msg.id;
                return (
                  <li key={msg.id}>
                    <button
                      type="button"
                      onClick={() => openMessage(msg)}
                      className={`w-full text-left px-4 py-3.5 transition-colors ${
                        active ? "bg-[#29425e]/08" : "hover:bg-[#F7F9FB]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {!msg.read && (
                              <span className="w-2 h-2 rounded-full bg-[#395c80] shrink-0" />
                            )}
                            <p
                              className={`truncate text-sm ${
                                msg.read ? "font-medium text-gray-700" : "font-bold text-[#0c1622]"
                              }`}
                            >
                              {msg.name}
                            </p>
                          </div>
                          <p className="truncate text-xs text-gray-500 mt-0.5">{msg.subject}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                          {formatWhen(msg.createdAt)}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={`lg:col-span-3 ${adminCard} p-5 sm:p-6 min-h-[320px]`}>
          {!selected ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400 py-20">
              Select a message to read it
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#0c1622] font-malayalam-display leading-snug">
                    {selected.subject}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{formatWhen(selected.createdAt)}</p>
                </div>
                <button
                  type="button"
                  disabled={busyId === selected.id}
                  onClick={() => deleteMessage(selected.id)}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-70"
                >
                  {busyId === selected.id ? "Deleting…" : "Delete"}
                </button>
              </div>

              <div className="rounded-2xl bg-[#F7F9FB] border border-[#29425e]/08 px-4 py-3 space-y-1">
                <p className="text-sm font-semibold text-[#0c1622]">{selected.name}</p>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="text-sm font-medium text-[#395c80] hover:underline"
                >
                  {selected.email}
                </a>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-[15px] text-[#0c1622] whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                className={adminBtnPrimary}
              >
                Reply by email
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
