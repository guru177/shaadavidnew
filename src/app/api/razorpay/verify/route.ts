import { NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillPaidOrder } from "@/lib/orderFulfillment";
import { getRazorpayKeySecret, isRazorpayLocalMock } from "@/lib/settings";

export async function POST(request: Request) {
  try {
    const keySecret = getRazorpayKeySecret();
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      address,
      items,
      qty = 1,
      couponCode,
      discountValue,
      taxAmount,
      subtotal,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !address) {
      return NextResponse.json({ error: "Missing payment or address details" }, { status: 400 });
    }

    const isMockPayment =
      isRazorpayLocalMock() &&
      String(razorpay_order_id).startsWith("order_mock_") &&
      String(razorpay_payment_id).startsWith("pay_mock_");

    if (!isMockPayment) {
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }
    }

    const { getDb } = await import("@/lib/db");
    const db = getDb();

    let lineItems = Array.isArray(items) ? items : null;
    if (!lineItems?.length) {
      if (!productId) {
        return NextResponse.json({ error: "Missing product" }, { status: 400 });
      }
      const product = (db.products || []).find((p: { id: string }) => p.id === productId);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const q = Math.max(1, Number(qty) || 1);
      const unit = Number(product.price);
      lineItems = [
        {
          productId: product.id,
          title: product.titleEn || product.title,
          qty: q,
          unitPrice: unit,
          amount: unit * q,
        },
      ];
    }

    const { order, created } = fulfillPaidOrder({
      items: lineItems,
      address,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentMethod: isMockPayment ? "Razorpay (Local Test)" : "Razorpay",
      couponCode,
      discountValue,
      taxAmount,
      subtotal,
    });

    // best-effort email
    try {
      const { sendOrderEmail } = await import("@/lib/email");
      if (created) await sendOrderEmail(order, "confirmation");
    } catch {
      /* optional */
    }

    return NextResponse.json(order, { status: created ? 201 : 200 });
  } catch (error) {
    console.error("Razorpay verify failed:", error);
    const message = error instanceof Error ? error.message : "Failed to verify payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
