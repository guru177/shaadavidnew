import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { restockItems, getOrderLineItems } from "@/lib/orderFulfillment";
import {
  enrichWithRazorpay,
  listPaymentTransactions,
  summarizePayments,
} from "@/lib/payments";
import { getRazorpayKeyId, getRazorpayKeySecret } from "@/lib/settings";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const enrich = searchParams.get("enrich") !== "0";
    let transactions = await listPaymentTransactions();
    if (enrich) {
      transactions = await enrichWithRazorpay(transactions);
    }
    return NextResponse.json({
      transactions,
      summary: summarizePayments(transactions),
    });
  } catch (err) {
    console.error("Payments GET failed", err);
    return NextResponse.json({ error: "Failed to load payments" }, { status: 500 });
  }
}

/** Refund a captured Razorpay payment (mirrors Orders → Refund). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = String(body?.orderId || "").trim();
    const action = String(body?.action || "refund").toLowerCase();

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }
    if (action !== "refund") {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }

    const db = await getDb();
    if (!Array.isArray(db.orders)) db.orders = [];
    const index = db.orders.findIndex((o: { id?: string }) => o.id === orderId);
    if (index < 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = { ...db.orders[index] } as Record<string, unknown>;

    if (String(order.paymentStatus) === "Refunded" || String(order.status) === "Refunded") {
      return NextResponse.json({ error: "Already refunded", order }, { status: 409 });
    }

    if (order.stockCommitted !== false) {
      restockItems(db, getOrderLineItems(order));
      order.stockCommitted = false;
    }

    order.status = "Refunded";
    order.paymentStatus = "Refunded";
    order.refundedAt = new Date().toISOString();
    order.refundAmount = Number(order.amountValue) || 0;
    order.refundStatus = "pending";

    const paymentId = order.razorpayPaymentId ? String(order.razorpayPaymentId) : "";
    if (paymentId && !paymentId.startsWith("pay_mock_")) {
      try {
        const key_id = await getRazorpayKeyId();
        const key_secret = await getRazorpayKeySecret();
        if (key_id && key_secret) {
          const Razorpay = (await import("razorpay")).default;
          const rzp = new Razorpay({ key_id, key_secret });
          const refund = await rzp.payments.refund(paymentId, {
            amount: Math.round(Number(order.amountValue) * 100),
          });
          order.refundId = refund?.id || null;
          order.refundStatus = refund?.status || "processed";
          if (refund?.amount != null) {
            order.refundAmount = Number(refund.amount) / 100;
          }
          order.refundError = null;
        } else {
          order.refundStatus = "skipped_no_keys";
          order.refundError = "Razorpay keys not configured";
        }
      } catch (err) {
        console.error("Razorpay refund failed", err);
        order.refundStatus = "failed";
        order.refundError = err instanceof Error ? err.message : "Refund API failed";
      }
    } else if (paymentId.startsWith("pay_mock_")) {
      order.refundId = `rfnd_mock_${Date.now()}`;
      order.refundStatus = "processed";
    } else {
      order.refundStatus = "manual";
      order.refundError = "No Razorpay payment id — marked refunded locally";
    }

    db.orders[index] = order;
    await saveDb(db);

    try {
      const { sendOrderEmail } = await import("@/lib/email");
      await sendOrderEmail(order, "status");
    } catch {
      /* optional */
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Payments POST failed", err);
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 });
  }
}
