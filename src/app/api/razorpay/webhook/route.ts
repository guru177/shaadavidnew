import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { fulfillPaidOrder } from "@/lib/orderFulfillment";
import { getRazorpayKeySecret } from "@/lib/settings";

async function getWebhookSecret() {
  return process.env.RAZORPAY_WEBHOOK_SECRET || (await getRazorpayKeySecret());
}

export async function POST(request: Request) {
  try {
    const secret = await getWebhookSecret();
    if (!secret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
    }

    const raw = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    if (signature !== expected) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(raw);
    const event = payload?.event;
    if (event !== "payment.captured" && event !== "order.paid") {
      return NextResponse.json({ ok: true, ignored: event });
    }

    const payment = payload?.payload?.payment?.entity || payload?.payload?.order?.entity;
    const paymentId = payment?.id || payload?.payload?.payment?.entity?.id;
    const orderId = payment?.order_id || payload?.payload?.order?.entity?.id;
    const notes = payment?.notes || {};

    if (!paymentId) {
      return NextResponse.json({ ok: true, skipped: "no payment id" });
    }

    const db = await getDb();
    const existing = (db.orders || []).find(
      (o: { razorpayPaymentId?: string }) => o.razorpayPaymentId === paymentId
    );
    if (existing) {
      return NextResponse.json({ ok: true, orderId: existing.id, existing: true });
    }

    const pending = (db.pendingPayments || []).find(
      (p: { razorpayOrderId?: string }) => p.razorpayOrderId === orderId
    );

    const productId = notes.productId || pending?.productId;
    const address = pending?.address;
    const items = pending?.items;

    if (!address || (!items?.length && !productId)) {
      // Cannot fulfill without address — leave for browser verify
      return NextResponse.json({
        ok: true,
        pending: true,
        message: "Payment captured; awaiting client verify with address",
      });
    }

    let lineItems = items;
    if (!lineItems?.length && productId) {
      const product = (db.products || []).find((p: { id: string }) => p.id === productId);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const qty = Number(pending?.qty) || 1;
      const unit = Number(product.price);
      lineItems = [
        {
          productId: product.id,
          title: product.titleEn || product.title,
          qty,
          unitPrice: unit,
          amount: unit * qty,
        },
      ];
    }

    const { order, created } = await fulfillPaidOrder({
      items: lineItems,
      address,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      paymentMethod: "Razorpay",
      couponCode: pending?.couponCode,
      discountValue: pending?.discountValue,
      taxAmount: pending?.taxAmount,
      subtotal: pending?.subtotal,
    });

    if (created) {
      try {
        const { sendOrderEmail } = await import("@/lib/email");
        await sendOrderEmail(order, "confirmation");
      } catch {
        /* optional */
      }
      try {
        const { notifyAdminNewOrder } = await import("@/lib/orderNotify");
        await notifyAdminNewOrder(order);
      } catch {
        /* optional */
      }
    }

    return NextResponse.json({ ok: true, orderId: order.id, created });
  } catch (error) {
    console.error("Razorpay webhook failed:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
