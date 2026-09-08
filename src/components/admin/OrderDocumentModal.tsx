"use client";

import React from "react";
import { createPortal } from "react-dom";
import {
  getOrderAddressLines,
  getOrderCustomerMobile,
  getOrderCustomerName,
  getOrderTrackUrl,
  getShippingQrPayload,
  printOrderDocument,
  type OrderDocumentData,
  type OrderDocumentKind,
  type OrderDocumentOptions,
} from "@/lib/orderDocuments";
import { code39DataUri } from "@/lib/barcode";

type Props = {
  open: boolean;
  kind: OrderDocumentKind;
  orders: OrderDocumentData[];
  options?: OrderDocumentOptions;
  onClose: () => void;
};

function InvoicePreview({
  order,
  options,
}: {
  order: OrderDocumentData;
  options: Required<OrderDocumentOptions>;
}) {
  const lines = getOrderAddressLines(order);
  const name = getOrderCustomerName(order);
  const firstName = name.split(" ")[0] || "friend";

  return (
    <div className="relative mx-auto flex h-[297mm] min-h-[297mm] w-full max-w-[210mm] flex-col overflow-hidden rounded-2xl border border-[#29425e]/15 bg-[radial-gradient(circle_at_top_right,rgba(57,92,128,0.08),transparent_42%),linear-gradient(180deg,#fff_0%,#f7f9fb_100%)] shadow-sm">
      <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#0c1622_0%,#29425e_40%,#395c80_70%,#0c1622_100%)]" />

      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
        {options.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={options.logoUrl} alt="" className="h-56 w-56 object-contain grayscale" />
        ) : (
          <span className="text-5xl font-black uppercase tracking-[0.12em] text-[#0c1622]">
            {options.siteName}
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-8 md:p-10">
        <div className="mb-5 flex flex-col gap-5 border-b-2 border-[#0c1622] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            {options.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={options.logoUrl}
                alt={options.siteName || "Logo"}
                className="h-14 w-14 rounded-full border-2 border-[#0c1622] bg-black object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0c1622] text-xs font-black text-white">
                SDA
              </div>
            )}
            <div>
              <p className="text-xl font-extrabold tracking-tight text-[#0c1622]">{options.siteName}</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#395c80]">{options.tagline}</p>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="mb-2 inline-block rounded-full bg-[linear-gradient(110deg,#29425e,#0c1622)] px-3 py-1 text-[10px] font-extrabold tracking-[0.16em] text-white">
              TAX / SALE INVOICE
            </span>
            <p className="text-xl font-extrabold text-[#0c1622]">{order.id}</p>
            <p className="text-xs text-gray-500">Date: {order.date || "—"}</p>
            <p className="text-xs text-gray-500">Status: {order.status || "—"}</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#29425e]/10 bg-white/80 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#395c80]">Bill To</p>
            <p className="font-semibold text-[#0c1622]">{name}</p>
            <p className="text-sm text-gray-600">{getOrderCustomerMobile(order)}</p>
            {lines.map((line) => (
              <p key={line} className="text-sm text-gray-600">
                {line}
              </p>
            ))}
          </div>
          <div className="rounded-2xl border border-[#29425e]/10 bg-white/80 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#395c80]">
              Payment Details
            </p>
            <p className="text-sm text-gray-600">
              Payment: <span className="font-semibold text-[#0c1622]">{order.paymentStatus || "—"}</span>
            </p>
            <p className="text-sm text-gray-600">Method: {order.paymentMethod || "—"}</p>
            {order.razorpayPaymentId && (
              <p className="mt-2 break-all text-xs text-gray-400">{order.razorpayPaymentId}</p>
            )}
          </div>
        </div>

        <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white/90">
          <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-3 bg-[linear-gradient(110deg,#0c1622,#29425e)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white">
            <span>#</span>
            <span>Description</span>
            <span>Qty</span>
            <span>Amount</span>
          </div>
          <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-3 border-t border-gray-100 px-4 py-5 text-sm">
            <span>1</span>
            <div>
              <p className="font-semibold text-[#0c1622]">{order.product || "Product"}</p>
              <p className="text-xs text-gray-400">Shaa David&apos;s English learning companion</p>
            </div>
            <span className="text-gray-600">1</span>
            <span className="font-semibold text-[#0c1622]">{order.amount || "—"}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 border-t-2 border-[#0c1622] bg-[#F4F7FA] px-4 py-3 text-sm font-extrabold">
            <span>Grand Total</span>
            <span>{order.amount || "—"}</span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end gap-4">
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-dashed border-[#29425e]/25 bg-white/70 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#395c80]">
              Order Notes
            </p>
            <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-gray-600">
              <li>This invoice confirms your purchase from {options.siteName}.</li>
              <li>Books are packed carefully and shipped after payment confirmation.</li>
              <li>
                Track your order anytime using Order ID <strong>{order.id}</strong> and your checkout
                mobile number.
              </li>
              <li>For delivery updates or support, contact us on WhatsApp or email.</li>
              <li>Please keep this invoice until your package is delivered and verified.</li>
            </ul>
            <div className="mt-auto border-t border-[#29425e]/10 pt-3">
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#395c80]">
                Learning tip
              </p>
              <p className="text-xs leading-relaxed text-gray-600">
                Practice one short English conversation every day. Consistency builds confidence faster
                than long, rare study sessions.
              </p>
              <p className="mt-1 font-malayalam text-xs font-semibold leading-relaxed text-[#29425e]">
                ഓരോ ദിവസവും ചെറിയ ഇംഗ്ലീഷ് സംഭാഷണം പരിശീലിക്കൂ — സ്ഥിരതയാണ് ആത്മവിശ്വാസം വളർത്തുന്നത്.
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#29425e]/15 bg-[linear-gradient(135deg,rgba(41,66,94,0.08),rgba(57,92,128,0.04))] p-5">
            <p className="text-lg font-extrabold text-[#0c1622]">Thank you, {firstName}!</p>
            <p className="mt-1 font-malayalam text-sm font-semibold text-[#29425e]">
              നന്ദി! ഞങ്ങളുടെ കൂടെ പഠിക്കാൻ തിരഞ്ഞെടുത്തതിന് ഹൃദയം നിറഞ്ഞ നന്ദി.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              We appreciate your order. Wishing you confident English speaking — one conversation at a
              time.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Keep this invoice for your records. We are grateful to be part of your learning journey.
            </p>
          </div>
        </div>

        <div className="mt-5 flex shrink-0 flex-col gap-2 border-t-2 border-[#0c1622] pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-bold text-[#0c1622]">{options.siteName}</p>
            <p className="text-xs text-gray-400">Learn English through Malayalam</p>
          </div>
          <div className="text-xs text-gray-400 sm:text-right">
            {options.supportEmail && <p>{options.supportEmail}</p>}
            {options.supportPhone && <p>{options.supportPhone}</p>}
            <p>This is a computer-generated invoice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelPreview({
  order,
  options,
}: {
  order: OrderDocumentData;
  options: Required<OrderDocumentOptions>;
}) {
  const lines = getOrderAddressLines(order);
  const name = getOrderCustomerName(order);
  const mobile = getOrderCustomerMobile(order);
  const trackUrl = getOrderTrackUrl(order, options.siteUrl);
  const [qrDataUrl, setQrDataUrl] = React.useState("");
  const barcodeDataUrl = React.useMemo(() => code39DataUri(order.id, { height: 52, moduleWidth: 1.5 }), [order.id]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(getShippingQrPayload(order, options.siteUrl), {
          margin: 1,
          width: 220,
          errorCorrectionLevel: "M",
          color: { dark: "#0c1622", light: "#ffffff" },
        });
        if (!cancelled) setQrDataUrl(url);
      } catch {
        if (!cancelled) setQrDataUrl("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [order, options.siteUrl]);

  return (
    <div className="mx-auto max-w-[420px] rounded-xl border-2 border-[#0c1622] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-400">From</p>
          <p className="font-extrabold text-[#0c1622]">{options.siteName}</p>
          <p className="text-xs text-gray-500">Kerala, India</p>
        </div>
        <div className="rounded-lg border border-[#0c1622] px-2.5 py-2 text-xs font-extrabold">
          {order.id}
        </div>
      </div>

      <div className="mb-4 border-y-2 border-dashed border-gray-300 py-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-400">Ship to</p>
        <p className="mt-1 text-xl font-extrabold text-[#0c1622]">{name}</p>
        <p className="mb-2 text-sm font-bold text-[#0c1622]">{mobile}</p>
        <div className="text-sm leading-relaxed text-gray-700">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="mb-4 space-y-2 text-xs">
        <div className="flex justify-between gap-3">
          <span className="font-bold uppercase tracking-wider text-gray-400">Product</span>
          <strong className="text-right text-[#0c1622]">{order.product || "—"}</strong>
        </div>
        <div className="flex justify-between gap-3">
          <span className="font-bold uppercase tracking-wider text-gray-400">Payment</span>
          <strong className="text-[#0c1622]">{order.paymentStatus || "—"}</strong>
        </div>
        <div className="flex justify-between gap-3">
          <span className="font-bold uppercase tracking-wider text-gray-400">Amount</span>
          <strong className="text-[#0c1622]">{order.amount || "—"}</strong>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-[96px_1fr] items-center gap-3 rounded-xl border border-[#0c1622]/15 bg-[#F8FAFC] p-3">
        <div className="text-center">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="Shipping QR" className="mx-auto h-24 w-24" />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded bg-white text-[10px] text-gray-400">
              QR…
            </div>
          )}
          <p className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-gray-400">
            Scan to track
          </p>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-400">
            Tracking link
          </p>
          <p className="mt-1 break-all text-[11px] font-semibold leading-snug text-[#0c1622]">
            {trackUrl}
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-gray-500">
            QR includes order ID, ship-to details, phone, and track link.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[#0c1622] px-3 py-3 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={barcodeDataUrl} alt={`Barcode ${order.id}`} className="mx-auto h-[52px] max-w-full" />
        <p className="mt-2 font-mono text-sm font-extrabold tracking-[0.18em] text-[#0c1622]">
          {order.id}
        </p>
      </div>
    </div>
  );
}

export default function OrderDocumentModal({
  open,
  kind,
  orders,
  options,
  onClose,
}: Props) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !orders.length || !mounted) return null;

  const resolved: Required<OrderDocumentOptions> = {
    siteName: options?.siteName || "Shaa David's Academy",
    logoUrl: options?.logoUrl || "/logo.png",
    tagline:
      options?.tagline || "മലയാളത്തിലൂടെ ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് പഠിക്കാം",
    supportEmail: options?.supportEmail || "",
    supportPhone: options?.supportPhone || "",
    siteUrl:
      options?.siteUrl ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
  };

  const title = kind === "invoice" ? "Invoice" : "Shipping label";
  const subtitle =
    orders.length === 1
      ? orders[0].id
      : `${orders.length} ${kind === "invoice" ? "invoices" : "labels"}`;

  return createPortal(
    <div className="fixed inset-0 z-[220] flex items-start justify-center overflow-y-auto p-0 sm:p-4 sm:pt-4">
      <div className="fixed inset-0 bg-[#0c1622]/55 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative z-10 my-0 flex min-h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:my-0 sm:min-h-0 sm:max-h-[calc(100vh-2rem)] sm:rounded-2xl animate-[modalFadeIn_0.2s_ease-out]">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
              {title}
              {kind === "invoice" ? " · A4" : ""}
            </p>
            <p className="text-lg font-semibold text-[#0c1622]">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void printOrderDocument(kind, orders, resolved)}
              className="inline-flex items-center gap-2 rounded-full bg-[#0c1622] px-4 py-2 text-sm font-semibold text-white hover:bg-[#29425e]"
            >
              Print / PDF{orders.length > 1 ? ` (${orders.length})` : ""}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto bg-[#E8EEF4] p-4 sm:p-6">
          {orders.map((order) =>
            kind === "invoice" ? (
              <InvoicePreview key={order.id} order={order} options={resolved} />
            ) : (
              <LabelPreview key={order.id} order={order} options={resolved} />
            )
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
