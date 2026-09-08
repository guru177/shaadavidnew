export type OrderDocumentData = {
  id: string;
  date?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  amount?: string;
  product?: string;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
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

export type OrderDocumentKind = "invoice" | "label";

export type OrderDocumentOptions = {
  siteName?: string;
  logoUrl?: string;
  tagline?: string;
  supportEmail?: string;
  supportPhone?: string;
  siteUrl?: string;
};

export function getOrderCustomerName(order: OrderDocumentData) {
  return order.shippingAddress?.name || order.customerDetails?.name || "Customer";
}

export function getOrderCustomerMobile(order: OrderDocumentData) {
  return order.shippingAddress?.mobile || order.customerDetails?.mobile || "—";
}

export function getOrderAddressLines(order: OrderDocumentData) {
  const a = order.shippingAddress;
  if (!a) return ["Address not available"];
  return [
    [a.flat, a.area].filter(Boolean).join(", "),
    [a.city, a.state].filter(Boolean).join(", "),
    a.pincode ? `PIN: ${a.pincode}` : "",
  ].filter(Boolean);
}

export function getOrderTrackUrl(order: OrderDocumentData, siteUrl?: string) {
  const base = (siteUrl || (typeof window !== "undefined" ? window.location.origin : "") || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  const mobile = getOrderCustomerMobile(order);
  const params = new URLSearchParams({ order: order.id });
  if (mobile && mobile !== "—") params.set("mobile", mobile);
  return `${base}/track?${params.toString()}`;
}

/** Payload encoded in the shipping QR (details + track link). */
export function getShippingQrPayload(order: OrderDocumentData, siteUrl?: string) {
  const name = getOrderCustomerName(order);
  const mobile = getOrderCustomerMobile(order);
  const lines = getOrderAddressLines(order);
  const trackUrl = getOrderTrackUrl(order, siteUrl);
  return [
    `TRACK: ${trackUrl}`,
    `ORDER: ${order.id}`,
    `NAME: ${name}`,
    `PHONE: ${mobile}`,
    `ADDR: ${lines.join(" | ")}`,
    `PRODUCT: ${order.product || "—"}`,
    `AMOUNT: ${order.amount || "—"}`,
    `PAYMENT: ${order.paymentStatus || "—"}`,
  ].join("\n");
}

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resolveOptions(options?: OrderDocumentOptions | string) {
  const fallbackSiteUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  if (typeof options === "string") {
    return {
      siteName: options,
      logoUrl: "",
      tagline: "മലയാളത്തിലൂടെ ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് പഠിക്കാം",
      supportEmail: "",
      supportPhone: "",
      siteUrl: fallbackSiteUrl,
    };
  }
  return {
    siteName: options?.siteName || "Shaa David's Academy",
    logoUrl: options?.logoUrl || "",
    tagline:
      options?.tagline ||
      "മലയാളത്തിലൂടെ ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് പഠിക്കാം",
    supportEmail: options?.supportEmail || "",
    supportPhone: options?.supportPhone || "",
    siteUrl: options?.siteUrl || fallbackSiteUrl,
  };
}

function invoiceHtml(order: OrderDocumentData, options?: OrderDocumentOptions | string) {
  const opts = resolveOptions(options);
  const lines = getOrderAddressLines(order);
  const name = getOrderCustomerName(order);
  const logo = opts.logoUrl
    ? `<img class="logo" src="${esc(opts.logoUrl)}" alt="${esc(opts.siteName)}" />`
    : `<div class="logo-fallback">SDA</div>`;
  const watermark = opts.logoUrl
    ? `<img class="watermark-img" src="${esc(opts.logoUrl)}" alt="" />`
    : `<div class="watermark-text">${esc(opts.siteName)}</div>`;

  return `
  <div class="a4 invoice">
    <div class="watermark" aria-hidden="true">${watermark}</div>
    <div class="accent-bar"></div>

    <header class="inv-header">
      <div class="brand-block">
        ${logo}
        <div>
          <div class="brand">${esc(opts.siteName)}</div>
          <div class="tagline">${esc(opts.tagline)}</div>
        </div>
      </div>
      <div class="inv-meta">
        <div class="inv-badge">TAX / SALE INVOICE</div>
        <div class="order-id">${esc(order.id)}</div>
        <div class="muted">Date: ${esc(order.date || "—")}</div>
        <div class="muted">Status: ${esc(order.status || "—")}</div>
      </div>
    </header>

    <section class="inv-grid">
      <div class="panel">
        <h3>Bill To</h3>
        <p class="strong">${esc(name)}</p>
        <p>${esc(getOrderCustomerMobile(order))}</p>
        ${lines.map((l) => `<p>${esc(l)}</p>`).join("")}
      </div>
      <div class="panel">
        <h3>Payment Details</h3>
        <p>Payment: <span class="strong">${esc(order.paymentStatus || "—")}</span></p>
        <p>Method: ${esc(order.paymentMethod || "—")}</p>
        ${order.razorpayPaymentId ? `<p class="tiny">Payment ID: ${esc(order.razorpayPaymentId)}</p>` : ""}
        ${order.razorpayOrderId ? `<p class="tiny">Gateway Order: ${esc(order.razorpayOrderId)}</p>` : ""}
      </div>
    </section>

    <table class="inv-table">
      <thead>
        <tr>
          <th style="width:8%">#</th>
          <th>Description</th>
          <th style="width:12%">Qty</th>
          <th style="width:22%">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>
            <div class="strong">${esc(order.product || "Product")}</div>
            <div class="tiny">Shaa David's English learning companion</div>
          </td>
          <td>1</td>
          <td class="strong">${esc(order.amount || "—")}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Grand Total</td>
          <td>${esc(order.amount || "—")}</td>
        </tr>
      </tfoot>
    </table>

    <div class="inv-fill">
      <section class="notes">
        <h3>Order Notes</h3>
        <ul>
          <li>This invoice confirms your purchase from ${esc(opts.siteName)}.</li>
          <li>Books are packed carefully and shipped after payment confirmation.</li>
          <li>Track your order anytime using Order ID <strong>${esc(order.id)}</strong> and your checkout mobile number.</li>
          <li>For delivery updates or support, contact us on WhatsApp or email.</li>
          <li>Please keep this invoice until your package is delivered and verified.</li>
        </ul>
        <div class="notes-tip">
          <div class="notes-tip-label">Learning tip</div>
          <p>Practice one short English conversation every day. Consistency builds confidence faster than long, rare study sessions.</p>
          <p class="notes-tip-ml">ഓരോ ദിവസവും ചെറിയ ഇംഗ്ലീഷ് സംഭാഷണം പരിശീലിക്കൂ — സ്ഥിരതയാണ് ആത്മവിശ്വാസം വളർത്തുന്നത്.</p>
        </div>
      </section>

      <section class="thanks">
        <div class="thanks-title">Thank you, ${esc(name.split(" ")[0] || "friend")}!</div>
        <p class="thanks-ml">നന്ദി! ഞങ്ങളുടെ കൂടെ പഠിക്കാൻ തിരഞ്ഞെടുത്തതിന് ഹൃദയം നിറഞ്ഞ നന്ദി.</p>
        <p>We appreciate your order. Wishing you confident English speaking — one conversation at a time.</p>
        <p class="tiny">Keep this invoice for your records. We are grateful to be part of your learning journey.</p>
      </section>
    </div>

    <footer class="inv-footer">
      <div>
        <div class="strong">${esc(opts.siteName)}</div>
        <div class="tiny">Learn English through Malayalam</div>
      </div>
      <div class="footer-right tiny">
        ${opts.supportEmail ? `<div>${esc(opts.supportEmail)}</div>` : ""}
        ${opts.supportPhone ? `<div>${esc(opts.supportPhone)}</div>` : ""}
        <div>This is a computer-generated invoice.</div>
      </div>
    </footer>
  </div>`;
}

function labelHtml(
  order: OrderDocumentData,
  options?: OrderDocumentOptions | string,
  media?: { qrDataUrl?: string; barcodeDataUrl?: string }
) {
  const opts = resolveOptions(options);
  const lines = getOrderAddressLines(order);
  const trackUrl = getOrderTrackUrl(order, opts.siteUrl);
  const qrImg = media?.qrDataUrl
    ? `<img class="qr-img" src="${esc(media.qrDataUrl)}" alt="Shipping QR" />`
    : "";
  const barcodeImg = media?.barcodeDataUrl
    ? `<img class="barcode-img" src="${esc(media.barcodeDataUrl)}" alt="Order barcode" />`
    : "";

  return `
  <div class="label-sheet">
    <div class="top">
      <div>
        <div class="from-label">FROM</div>
        <div class="brand">${esc(opts.siteName)}</div>
        <div class="muted">Kerala, India</div>
      </div>
      <div class="badge">${esc(order.id)}</div>
    </div>
    <div class="ship-to">
      <div class="from-label">SHIP TO</div>
      <div class="name">${esc(getOrderCustomerName(order))}</div>
      <div class="phone">${esc(getOrderCustomerMobile(order))}</div>
      <div class="addr">${lines.map((l) => esc(l)).join("<br/>")}</div>
    </div>
    <div class="meta">
      <div><span>Product</span><strong>${esc(order.product || "—")}</strong></div>
      <div><span>COD / Paid</span><strong>${esc(order.paymentStatus || "—")}</strong></div>
      <div><span>Amount</span><strong>${esc(order.amount || "—")}</strong></div>
    </div>
    <div class="scan-block">
      <div class="qr-wrap">
        ${qrImg}
        <div class="scan-caption">Scan for tracking</div>
      </div>
      <div class="scan-meta">
        <div class="from-label">Tracking link</div>
        <div class="track-url">${esc(trackUrl)}</div>
        <div class="scan-hint">QR includes order ID, ship-to details, phone, and track link.</div>
      </div>
    </div>
    <div class="barcode">
      ${barcodeImg}
      <div class="barcode-text">${esc(order.id)}</div>
    </div>
  </div>`;
}

const SHARED_STYLES = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body {
    font-family: "Segoe UI", Arial, sans-serif;
    color: #0c1622;
    margin: 0;
    padding: 0;
    background: #e8eef4;
  }
  .doc-page { page-break-after: always; break-after: page; }
  .doc-page:last-child { page-break-after: auto; break-after: auto; }

  .a4.invoice {
    position: relative;
    width: 210mm;
    min-height: 297mm;
    height: 297mm;
    margin: 0 auto;
    padding: 14mm 16mm 12mm;
    background:
      radial-gradient(circle at top right, rgba(57,92,128,0.08), transparent 42%),
      linear-gradient(180deg, #ffffff 0%, #f7f9fb 100%);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .accent-bar {
    position: absolute;
    left: 0; top: 0; right: 0;
    height: 8px;
    background: linear-gradient(90deg, #0c1622 0%, #29425e 40%, #395c80 70%, #0c1622 100%);
  }
  .watermark {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    opacity: 0.06;
    z-index: 0;
  }
  .watermark-img {
    width: 280px;
    height: 280px;
    object-fit: contain;
    filter: grayscale(1);
  }
  .watermark-text {
    font-size: 48px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #0c1622;
  }
  .invoice > *:not(.watermark):not(.accent-bar) { position: relative; z-index: 1; }

  .inv-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 18px;
    margin-bottom: 18px;
    border-bottom: 2px solid #0c1622;
    flex-shrink: 0;
  }
  .brand-block { display: flex; gap: 14px; align-items: center; }
  .logo {
    width: 64px;
    height: 64px;
    border-radius: 999px;
    object-fit: cover;
    border: 2px solid #0c1622;
    background: #000;
  }
  .logo-fallback {
    width: 64px;
    height: 64px;
    border-radius: 999px;
    background: #0c1622;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 14px;
  }
  .brand { font-size: 22px; font-weight: 800; letter-spacing: 0.02em; color: #0c1622; }
  .tagline { margin-top: 4px; font-size: 12px; color: #395c80; max-width: 280px; line-height: 1.45; }
  .inv-meta { text-align: right; }
  .inv-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    color: #fff;
    background: linear-gradient(110deg, #29425e, #0c1622);
    padding: 6px 10px;
    border-radius: 999px;
    margin-bottom: 8px;
  }
  .order-id { font-size: 22px; font-weight: 800; color: #0c1622; }
  .muted { color: #64748b; font-size: 12px; margin-top: 2px; }
  .tiny { font-size: 11px; color: #64748b; word-break: break-all; }
  .strong { font-weight: 700; color: #0c1622; }

  .inv-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 18px;
    flex-shrink: 0;
  }
  .panel {
    background: rgba(255,255,255,0.85);
    border: 1px solid rgba(41,66,94,0.12);
    border-radius: 14px;
    padding: 14px 16px;
  }
  h3 {
    margin: 0 0 10px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #395c80;
  }
  p { margin: 0 0 4px; font-size: 13px; line-height: 1.5; }

  .inv-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 18px;
    background: rgba(255,255,255,0.9);
    border-radius: 14px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .inv-table th, .inv-table td {
    text-align: left;
    padding: 14px 14px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 13px;
  }
  .inv-table th {
    background: linear-gradient(110deg, #0c1622, #29425e);
    color: #fff;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .inv-table tbody td {
    padding-top: 22px;
    padding-bottom: 22px;
  }
  .inv-table tfoot td {
    font-weight: 800;
    border-bottom: 0;
    background: #f4f7fa;
    font-size: 15px;
  }

  .inv-fill {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 14px;
    min-height: 0;
  }

  .notes {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    border: 1px dashed rgba(41,66,94,0.25);
    border-radius: 14px;
    padding: 16px 18px;
    background: rgba(255,255,255,0.7);
    min-height: 0;
  }
  .notes h3 { margin-bottom: 8px; }
  .notes ul {
    margin: 0;
    padding-left: 18px;
    color: #475569;
    font-size: 12px;
    line-height: 1.75;
  }
  .notes-tip {
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid rgba(41,66,94,0.12);
  }
  .notes-tip-label {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #395c80;
    margin-bottom: 6px;
  }
  .notes-tip p {
    margin: 0 0 6px;
    font-size: 12px;
    color: #475569;
    line-height: 1.6;
  }
  .notes-tip-ml {
    font-size: 12px !important;
    color: #29425e !important;
    font-weight: 600;
  }

  .thanks {
    border: 1px solid rgba(41,66,94,0.14);
    border-radius: 16px;
    padding: 20px 18px;
    background: linear-gradient(135deg, rgba(41,66,94,0.08), rgba(57,92,128,0.04));
    flex-shrink: 0;
  }
  .thanks-title {
    font-size: 20px;
    font-weight: 800;
    color: #0c1622;
    margin-bottom: 8px;
  }
  .thanks-ml {
    font-size: 14px;
    color: #29425e;
    font-weight: 600;
    margin-bottom: 8px !important;
  }

  .inv-footer {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    border-top: 2px solid #0c1622;
    padding-top: 14px;
    margin-top: 8px;
    flex-shrink: 0;
  }
  .footer-right { text-align: right; }

  .label-sheet {
    width: 100%;
    max-width: 420px;
    margin: 16px auto;
    border: 2px solid #0c1622;
    border-radius: 12px;
    padding: 18px;
    min-height: 360px;
    background: #fff;
  }
  .top { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; margin-bottom:16px; }
  .from-label { font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:#64748b; font-weight:800; margin-bottom:4px; }
  .brand { font-size:16px; font-weight:800; }
  .badge { border:1px solid #0c1622; border-radius:8px; padding:8px 10px; font-weight:800; font-size:13px; white-space:nowrap; }
  .ship-to { border-top:2px dashed #cbd5e1; border-bottom:2px dashed #cbd5e1; padding:16px 0; margin-bottom:14px; }
  .name { font-size:22px; font-weight:800; margin:4px 0 6px; }
  .phone { font-size:14px; font-weight:700; margin-bottom:8px; }
  .addr { font-size:14px; line-height:1.55; }
  .meta { display:grid; gap:8px; margin-bottom:16px; }
  .meta div { display:flex; justify-content:space-between; gap:12px; font-size:12px; }
  .meta span { color:#64748b; text-transform:uppercase; letter-spacing:0.08em; font-weight:700; }
  .scan-block {
    display: grid;
    grid-template-columns: 112px 1fr;
    gap: 14px;
    align-items: center;
    border: 1px solid rgba(12,22,34,0.12);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 14px;
    background: #f8fafc;
  }
  .qr-wrap { text-align: center; }
  .qr-img {
    width: 96px;
    height: 96px;
    display: block;
    margin: 0 auto;
    image-rendering: pixelated;
  }
  .scan-caption {
    margin-top: 6px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #64748b;
  }
  .track-url {
    font-size: 11px;
    line-height: 1.45;
    word-break: break-all;
    color: #0c1622;
    font-weight: 600;
  }
  .scan-hint {
    margin-top: 8px;
    font-size: 10px;
    color: #64748b;
    line-height: 1.4;
  }
  .barcode {
    text-align: center;
    border: 1px solid #0c1622;
    border-radius: 8px;
    padding: 12px 10px 10px;
    background: #fff;
  }
  .barcode-img {
    display: block;
    max-width: 100%;
    height: 52px;
    margin: 0 auto;
  }
  .barcode-text {
    margin-top: 8px;
    font-family: "Courier New", monospace;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.18em;
  }

  @media print {
    body { background: #fff; }
    .a4.invoice { margin: 0; box-shadow: none; }
  }
`;

function printHtml(title: string, body: string) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    alert("Unable to prepare print preview.");
    return;
  }

  doc.open();
  doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${esc(title)}</title>
<style>${SHARED_STYLES}</style></head><body>${body}</body></html>`);
  doc.close();

  const runPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 1000);
    }
  };

  // Wait for logo images before printing
  const imgs = Array.from(doc.images || []);
  if (!imgs.length) {
    setTimeout(runPrint, 150);
    return;
  }
  let left = imgs.length;
  const done = () => {
    left -= 1;
    if (left <= 0) setTimeout(runPrint, 120);
  };
  imgs.forEach((img) => {
    if (img.complete) done();
    else {
      img.onload = done;
      img.onerror = done;
    }
  });
}

/** Print one or many documents without opening a visible new tab. */
export async function printOrderDocument(
  kind: OrderDocumentKind,
  orders: OrderDocumentData | OrderDocumentData[],
  options?: OrderDocumentOptions | string
) {
  const list = Array.isArray(orders) ? orders : [orders];
  if (!list.length) return;
  const opts = resolveOptions(options);

  const title =
    list.length === 1
      ? kind === "invoice"
        ? `Invoice ${list[0].id}`
        : `Shipping Label ${list[0].id}`
      : kind === "invoice"
        ? `Invoices (${list.length})`
        : `Shipping Labels (${list.length})`;

  let body = "";
  if (kind === "invoice") {
    body = list
      .map((order) => `<div class="doc-page">${invoiceHtml(order, opts)}</div>`)
      .join("");
  } else {
    const QRCode = (await import("qrcode")).default;
    const { code39DataUri } = await import("@/lib/barcode");
    const pages = await Promise.all(
      list.map(async (order) => {
        const qrDataUrl = await QRCode.toDataURL(getShippingQrPayload(order, opts.siteUrl), {
          margin: 1,
          width: 240,
          errorCorrectionLevel: "M",
          color: { dark: "#0c1622", light: "#ffffff" },
        });
        const barcodeDataUrl = code39DataUri(order.id, { height: 52, moduleWidth: 1.6 });
        return `<div class="doc-page">${labelHtml(order, opts, { qrDataUrl, barcodeDataUrl })}</div>`;
      })
    );
    body = pages.join("");
  }

  printHtml(title, body);
}
