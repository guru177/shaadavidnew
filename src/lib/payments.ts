import "server-only";
import { getDb } from "@/lib/db";
import { getRazorpayKeyId, getRazorpayKeySecret } from "@/lib/settings";
import type {
  PaymentGatewayDetail,
  PaymentSummary,
  PaymentTransaction,
} from "@/types/payments";

export type { PaymentGatewayDetail, PaymentSummary, PaymentTransaction };

function parseAmount(order: Record<string, unknown>): number {
  if (typeof order.amountValue === "number" && Number.isFinite(order.amountValue)) {
    return order.amountValue;
  }
  const raw = String(order.amount || "").replace(/[^\d.]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function normalizeStatus(order: Record<string, unknown>): PaymentTransaction["status"] {
  const pay = String(order.paymentStatus || "").toLowerCase();
  const st = String(order.status || "").toLowerCase();
  if (pay === "refunded" || st === "refunded") return "refunded";
  if (pay === "paid") return "captured";
  if (pay === "pending") return "pending";
  if (pay === "unpaid" || !pay) {
    const method = String(order.paymentMethod || "").toLowerCase();
    if (method.includes("cod")) return "unpaid";
    return order.razorpayPaymentId ? "pending" : "unpaid";
  }
  return "pending";
}

export function orderToPaymentTransaction(order: Record<string, unknown>): PaymentTransaction {
  const amount = parseAmount(order);
  const razorpayPaymentId = (order.razorpayPaymentId as string | null | undefined) || null;
  const id = razorpayPaymentId || `local_${order.id}`;
  const customer = (order.customerDetails || order.shippingAddress || {}) as Record<string, string>;
  const shipping = (order.shippingAddress || {}) as Record<string, string>;

  return {
    id,
    orderId: String(order.id || ""),
    razorpayOrderId: (order.razorpayOrderId as string | null | undefined) || null,
    razorpayPaymentId,
    amount,
    currency: String(order.currency || "INR"),
    status: normalizeStatus(order),
    paymentStatus: String(order.paymentStatus || "—"),
    orderStatus: String(order.status || "—"),
    method: String(order.paymentMethod || (razorpayPaymentId ? "Razorpay" : "—")),
    customerName: customer.name || shipping.name || "",
    customerMobile: customer.mobile || shipping.mobile || "",
    customerEmail: customer.email || "",
    product: String(order.product || ""),
    createdAt: String(order.createdAt || order.date || ""),
    date: String(order.date || ""),
    refundId: (order.refundId as string | null | undefined) || null,
    refundAmount:
      typeof order.refundAmount === "number"
        ? order.refundAmount
        : order.paymentStatus === "Refunded"
          ? amount
          : null,
    refundedAt: (order.refundedAt as string | null | undefined) || null,
    refundStatus: (order.refundStatus as string | null | undefined) || null,
    refundError: (order.refundError as string | null | undefined) || null,
    screenshotUrl: (order.screenshotUrl as string | null | undefined) || null,
    notes: (order.notes as string | null | undefined) || null,
    gateway: null,
  };
}

export async function listPaymentTransactions(): Promise<PaymentTransaction[]> {
  const db = await getDb();
  const orders = Array.isArray(db.orders) ? db.orders : [];
  const rows = orders
    .map((o) => orderToPaymentTransaction(o as Record<string, unknown>))
    .sort((a, b) => {
      const ta = new Date(a.createdAt || a.date || 0).getTime();
      const tb = new Date(b.createdAt || b.date || 0).getTime();
      return (Number.isFinite(tb) ? tb : 0) - (Number.isFinite(ta) ? ta : 0);
    });
  return rows;
}

async function getRazorpayClient() {
  const key_id = await getRazorpayKeyId();
  const key_secret = await getRazorpayKeySecret();
  if (!key_id || !key_secret) return null;
  const Razorpay = (await import("razorpay")).default;
  return new Razorpay({ key_id, key_secret });
}

/** Enrich a subset of online payments with live Razorpay payment + refund details. */
export async function enrichWithRazorpay(
  rows: PaymentTransaction[],
  limit = 40
): Promise<PaymentTransaction[]> {
  const rzp = await getRazorpayClient();
  if (!rzp) return rows;

  const targets = rows.filter(
    (r) => r.razorpayPaymentId && !String(r.razorpayPaymentId).startsWith("pay_mock_")
  ).slice(0, limit);

  await Promise.all(
    targets.map(async (row) => {
      try {
        const payment = await rzp.payments.fetch(row.razorpayPaymentId!);
        const amountPaise = Number(payment.amount || 0);
        const refundedPaise = Number(payment.amount_refunded || 0);
        let status = row.status;
        if (payment.status === "refunded" || refundedPaise >= amountPaise) status = "refunded";
        else if (refundedPaise > 0) status = "partial_refund";
        else if (payment.status === "captured") status = "captured";
        else if (payment.status === "authorized") status = "authorized";
        else if (payment.status === "failed") status = "failed";

        const method = String(payment.method || row.method);
        let methodDetail = method;
        if (payment.vpa) methodDetail = `UPI · ${payment.vpa}`;
        else if (payment.bank) methodDetail = `${method} · ${payment.bank}`;
        else if (payment.wallet) methodDetail = `Wallet · ${payment.wallet}`;
        else if (payment.card) {
          const card = payment.card as { network?: string; last4?: string };
          methodDetail = `${card.network || "Card"} ·•••• ${card.last4 || ""}`.trim();
        }

        row.status = status;
        row.method = method;
        row.methodDetail = methodDetail;
        row.customerEmail = row.customerEmail || String(payment.email || "");
        row.customerMobile = row.customerMobile || String(payment.contact || "").replace(/^\+/, "");
        row.gateway = {
          fee: payment.fee != null ? Number(payment.fee) / 100 : undefined,
          tax: payment.tax != null ? Number(payment.tax) / 100 : undefined,
          bank: payment.bank ? String(payment.bank) : undefined,
          wallet: payment.wallet ? String(payment.wallet) : undefined,
          vpa: payment.vpa ? String(payment.vpa) : undefined,
          cardNetwork: payment.card ? String((payment.card as { network?: string }).network || "") : undefined,
          cardLast4: payment.card ? String((payment.card as { last4?: string }).last4 || "") : undefined,
          errorCode: payment.error_code ? String(payment.error_code) : undefined,
          errorDescription: payment.error_description ? String(payment.error_description) : undefined,
          international: Boolean(payment.international),
          amountRefunded: refundedPaise / 100,
          captured: Boolean(payment.captured),
        };

        if (refundedPaise > 0 && !row.refundAmount) {
          row.refundAmount = refundedPaise / 100;
        }

        // Latest refund entity if any
        try {
          const refunds = await rzp.payments.fetchMultipleRefund(row.razorpayPaymentId!);
          const itemsUnknown = (refunds as { items?: unknown }).items;
          const list = Array.isArray(itemsUnknown)
            ? itemsUnknown
            : Array.isArray(refunds)
              ? refunds
              : [];
          if (list.length) {
            const latest = list[0] as {
              id?: string;
              status?: string;
              amount?: number;
              created_at?: number;
            };
            row.refundId = row.refundId || String(latest.id || "");
            row.refundStatus = String(latest.status || row.refundStatus || "");
            if (latest.amount != null) row.refundAmount = Number(latest.amount) / 100;
            if (latest.created_at) {
              row.refundedAt =
                row.refundedAt ||
                new Date(Number(latest.created_at) * 1000).toISOString();
            }
          }
        } catch {
          /* optional */
        }
      } catch (err) {
        console.error("Razorpay enrich failed", row.razorpayPaymentId, err);
      }
    })
  );

  return rows;
}

export function summarizePayments(rows: PaymentTransaction[]): PaymentSummary {
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
    if (r.status === "unpaid" || r.status === "pending") {
      unpaidCount += 1;
    }
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
