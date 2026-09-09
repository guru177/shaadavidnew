"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type AdminConfirmOptions = {
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Destructive styling (default true for delete flows). */
  danger?: boolean;
};

type Pending = AdminConfirmOptions & {
  resolve: (value: boolean) => void;
};

type DialogProps = AdminConfirmOptions & {
  open: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Styled in-app confirm modal (replaces window.confirm). */
export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  busy = false,
  onConfirm,
  onCancel,
}: DialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-[#0c1622]/55 backdrop-blur-[2px]"
        onClick={() => !busy && onCancel()}
      />
      <div className="relative w-full max-w-md bg-white rounded-[24px] border border-[#29425e]/10 shadow-[0_24px_60px_rgba(12,22,34,0.18)] overflow-hidden p-6">
        <h3 className="text-lg font-semibold text-[#0c1622] font-malayalam-display">{title}</h3>
        {description ? <div className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</div> : null}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="px-4 py-2.5 rounded-full border border-[#29425e]/12 text-sm font-semibold text-gray-700 hover:bg-[#F7F9FB] transition-colors disabled:opacity-70"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={
              danger
                ? "px-4 py-2.5 rounded-full bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-70"
                : "px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer disabled:opacity-70"
            }
          >
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Promise-based confirm for drop-in replacement of window.confirm. */
export function useAdminConfirm() {
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);

  const ask = useCallback((opts: AdminConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...opts, resolve });
    });
  }, []);

  const close = useCallback(
    (value: boolean) => {
      if (!pending) return;
      pending.resolve(value);
      setPending(null);
      setBusy(false);
    },
    [pending]
  );

  const dialog = (
    <AdminConfirmDialog
      open={Boolean(pending)}
      title={pending?.title || ""}
      description={pending?.description}
      confirmLabel={pending?.confirmLabel}
      cancelLabel={pending?.cancelLabel}
      danger={pending?.danger ?? true}
      busy={busy}
      onCancel={() => close(false)}
      onConfirm={() => close(true)}
    />
  );

  return { ask, dialog, setBusy };
}
