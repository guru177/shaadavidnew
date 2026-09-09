import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mobilesMatch, normalizeOrderStatus, statusLabel } from "@/lib/orders";

function buildTrackPayload(order: Record<string, any>) {
  return {
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
  };
}

async function lookupOrder(orderId: string, mobile: string) {
  const id = orderId.trim();
  const mob = mobile.trim();
  if (!id || !mob) {
    return { error: "Order ID and mobile number are required", status: 400 as const };
  }

  const db = await getDb();
  const needle = id.toLowerCase();
  const order = (db.orders || []).find(
    (o: { id?: string }) => String(o.id).toLowerCase() === needle
  );

  if (!order) {
    return { error: "Order not found", status: 404 as const };
  }

  const orderMobile = order.shippingAddress?.mobile || order.customerDetails?.mobile || "";
  if (!mobilesMatch(orderMobile, mob)) {
    return { error: "Mobile number does not match this order", status: 403 as const };
  }

  return { order };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await lookupOrder(String(body.orderId || ""), String(body.mobile || ""));
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(buildTrackPayload(result.order));
  } catch {
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}

/** GET for fast link opens: /api/orders/track?orderId=…&mobile=… */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await lookupOrder(
      String(searchParams.get("orderId") || ""),
      String(searchParams.get("mobile") || "")
    );
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(buildTrackPayload(result.order), {
      headers: { "Cache-Control": "private, max-age=15" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
