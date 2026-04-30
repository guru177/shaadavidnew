"use client";

import React from "react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

const invoiceItems = [
  {
    name: "Shaa David English Companion",
    description: "Premium Edition · Hardcover",
    qty: 1,
    price: 499.0,
  },
];

export default function InvoiceModal({
  isOpen,
  onClose,
  orderId = "#OD-3847291847",
}: InvoiceModalProps) {
  if (!isOpen) return null;

  const subtotal = invoiceItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = 0;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handlePrint = () => {
    const itemRows = invoiceItems
      .map(
        (item) => `
        <tr>
          <td style="padding:14px 16px;">
            <div style="font-weight:600;color:#0c1622;font-size:13px;">${item.name}</div>
            <div style="color:#9ca3af;font-size:11px;margin-top:2px;">${item.description}</div>
          </td>
          <td style="padding:14px 16px;text-align:center;color:#4b5563;font-size:13px;">${item.qty}</td>
          <td style="padding:14px 16px;text-align:center;color:#4b5563;font-size:13px;">&#8377;${item.price.toFixed(2)}</td>
          <td style="padding:14px 16px;text-align:right;font-weight:600;color:#0c1622;font-size:13px;">&#8377;${(item.price * item.qty).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${orderId} — Shaa David</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #0c1622; padding: 40px; }
    .invoice-wrap { max-width: 720px; margin: 0 auto; }

    /* Header */
    .inv-header { background: linear-gradient(135deg, #0c1622 0%, #1a2c42 100%); color: white; border-radius: 16px 16px 0 0; padding: 32px 40px; display: flex; justify-content: space-between; align-items: flex-start; }
    .inv-header .brand { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .inv-header .brand span { display: block; font-size: 12px; font-weight: 400; opacity: 0.55; margin-top: 4px; letter-spacing: 0; }
    .inv-header .inv-meta { text-align: right; }
    .inv-header .inv-meta .label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.45; margin-bottom: 4px; }
    .inv-header .inv-meta .value { font-size: 13px; font-weight: 600; }

    /* Body */
    .inv-body { border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 36px 40px; }

    /* Addresses */
    .addr-row { display: flex; gap: 48px; margin-bottom: 32px; padding-bottom: 28px; border-bottom: 1px solid #f3f4f6; }
    .addr-col { flex: 1; }
    .addr-col .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; font-weight: 700; margin-bottom: 8px; }
    .addr-col .name { font-weight: 600; font-size: 14px; color: #0c1622; margin-bottom: 4px; }
    .addr-col p { font-size: 12px; color: #6b7280; line-height: 1.7; }

    /* Order ref */
    .order-ref { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 18px; margin-bottom: 28px; }
    .order-ref .ref-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; font-weight: 700; margin-bottom: 3px; }
    .order-ref .ref-val { font-family: monospace; font-weight: 700; color: #395c80; font-size: 13px; }
    .order-ref .badge { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; }

    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    thead tr { border-bottom: 1px solid #f3f4f6; }
    thead th { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; font-weight: 700; padding: 0 16px 10px; text-align: left; }
    thead th.right { text-align: right; }
    thead th.center { text-align: center; }
    tbody tr { border-bottom: 1px solid #f9fafb; }
    tbody tr:last-child { border-bottom: none; }

    /* Totals */
    .totals { margin-left: auto; width: 260px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 13px; color: #4b5563; padding: 5px 0; }
    .totals-row.free { color: #059669; font-weight: 600; }
    .totals-divider { border: none; border-top: 1px solid #e5e7eb; margin: 10px 0; }
    .totals-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #0c1622; padding-top: 6px; }

    /* Footer */
    .inv-footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
    .inv-footer p { font-size: 11px; color: #9ca3af; }
    .inv-footer .tagline { font-size: 12px; color: #6b7280; }

    @media print {
      body { padding: 0; }
      .invoice-wrap { max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="invoice-wrap">
    <div class="inv-header">
      <div class="brand">
        Shaa David
        <span>Official Invoice</span>
      </div>
      <div class="inv-meta">
        <div class="label">Invoice Date</div>
        <div class="value">15 April 2026</div>
        <div class="label" style="margin-top:12px;">Order ID</div>
        <div class="value" style="font-family:monospace;">${orderId}</div>
      </div>
    </div>

    <div class="inv-body">
      <div class="addr-row">
        <div class="addr-col">
          <div class="lbl">Billed To</div>
          <div class="name">John Doe</div>
          <p>Flat 402, Skyline Apartments<br/>MG Road, Ernakulam<br/>Kochi, Kerala - 682011<br/>+91 9876543210</p>
        </div>
        <div class="addr-col">
          <div class="lbl">From</div>
          <div class="name">Shaa David</div>
          <p>Shaa David Publications<br/>42, Publishing House Lane<br/>Chennai, TN - 600001<br/>support@shaadavid.com</p>
        </div>
      </div>

      <div class="order-ref">
        <div>
          <div class="ref-lbl">Order Reference</div>
          <div class="ref-val">${orderId}</div>
        </div>
        <div class="badge">&#10003; Payment Confirmed</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="center">Qty</th>
            <th class="center">Unit Price</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div class="totals">
        <div class="totals-row"><span>Subtotal</span><span>&#8377;${subtotal.toFixed(2)}</span></div>
        <div class="totals-row free"><span>Shipping</span><span>Free</span></div>
        <div class="totals-row"><span>GST (18%)</span><span>&#8377;${tax.toFixed(2)}</span></div>
        <hr class="totals-divider" />
        <div class="totals-total"><span>Total Paid</span><span>&#8377;${total.toFixed(2)}</span></div>
      </div>

      <div class="inv-footer">
        <p>Thank you for your purchase!</p>
        <p class="tagline">Shaa David &mdash; The Complete Guide to English</p>
      </div>
    </div>
  </div>
  <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; }</script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=800,height=900");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.15)] border border-white overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0c1622] to-[#1a2c42] px-8 py-7 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#395c80]/40 rounded-full blur-2xl" />
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-white text-lg font-semibold">Invoice</h2>
              </div>
              <p className="text-white/60 text-sm pl-11">Order {orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Invoice Date</p>
              <p className="text-white font-semibold text-sm mt-0.5">15 April 2026</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="px-8 py-8 overflow-y-auto max-h-[60vh]">

          {/* Billing info */}
          <div className="flex gap-8 mb-8">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Billed To</p>
              <p className="font-semibold text-[#0c1622]">John Doe</p>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                Flat 402, Skyline Apartments<br />
                MG Road, Ernakulam<br />
                Kochi, Kerala - 682011
              </p>
              <p className="text-sm text-gray-500 mt-1">+91 9876543210</p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">From</p>
              <p className="font-semibold text-[#0c1622]">Shaa David</p>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                Shaa David Publications<br />
                42, Publishing House Lane<br />
                Chennai, TN - 600001
              </p>
              <p className="text-sm text-gray-500 mt-1">support@shaadavid.com</p>
            </div>
          </div>

          {/* Order ID + Status */}
          <div className="flex items-center justify-between bg-[#f8fafc] rounded-xl px-5 py-3 mb-8 border border-gray-100">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Order Reference</span>
              <p className="font-mono font-semibold text-[#395c80] text-sm mt-0.5">{orderId}</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
              ✓ Payment Confirmed
            </span>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 px-1">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-center">Unit Price</span>
              <span className="col-span-2 text-right">Total</span>
            </div>
            <div className="space-y-2">
              {invoiceItems.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-gray-200 transition-colors"
                >
                  <div className="col-span-6">
                    <p className="font-medium text-[#0c1622] text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <p className="col-span-2 text-center text-sm text-gray-600">{item.qty}</p>
                  <p className="col-span-2 text-center text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
                  <p className="col-span-2 text-right text-sm font-semibold text-[#0c1622]">₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 pt-6 space-y-3 max-w-xs ml-auto">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>GST (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <div className="flex justify-between font-bold text-[#0c1622]">
              <span>Total Paid</span>
              <span className="text-lg">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-gray-100 bg-[#f8fafc] flex items-center justify-between">
          <p className="text-xs text-gray-400">Thank you for your purchase 🎉</p>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 border-2 border-gray-200 text-[#0c1622] px-5 py-2.5 rounded-xl text-sm font-medium hover:border-[#0c1622] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-[#0c1622] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a2c42] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
