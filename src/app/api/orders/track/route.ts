import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mobilesMatch, normalizeOrderStatus, statusLabel } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = String(body.orderId || "").trim();
    const mobile = String(body.mobile || "").trim();

    if (!orderId || !mobile) {
      return NextResponse.json(
        { error: "Order ID and mobile number are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const order = (db.orders || []).find(
      (o: { id?: string }) => String(o.id).toLowerCase() === orderId.toLowerCase()
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderMobile = order.shippingAddress?.mobile || order.customerDetails?.mobile || "";
    if (!mobilesMatch(orderMobile, mobile)) {
      return NextResponse.json(
        { error: "Mobile number does not match this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: order.id,
      status: normalizeOrderStatus(order.status),
      statusLabel: statusLabel(order.status),
      date: order.date || "",
      product: order.product || "",
      amount: order.amount || "",
      paymentStatus: order.paymentStatus || "",
      paymentMethod: order.paymentMethod || "",
      customerName: order.shippingAddress?.name || order.customerDetails?.name || "",
      shippingCity: order.shippingAddress?.city || "",
      shippingState: order.shippingAddress?.state || "",
      shippingPincode: order.shippingAddress?.pincode || "",
      carrier: order.carrier || "",
      awb: order.awb || "",
      trackingUrl: order.trackingUrl || "",
    });
  } catch {
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
