import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mobilesMatch } from "@/lib/orders";

/** Public: list orders for a mobile (redacted). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mobile = String(body.mobile || "").trim();
    if (!mobile) {
      return NextResponse.json({ error: "Mobile required" }, { status: 400 });
    }

    const db = getDb();
    const orders = (db.orders || [])
      .filter((o: any) => {
        const m = o.shippingAddress?.mobile || o.customerDetails?.mobile || "";
        return mobilesMatch(m, mobile);
      })
      .map((o: any) => ({
        id: o.id,
        date: o.date,
        status: o.status,
        paymentStatus: o.paymentStatus,
        amount: o.amount,
        product: o.product,
        carrier: o.carrier || "",
        awb: o.awb || "",
      }));

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
