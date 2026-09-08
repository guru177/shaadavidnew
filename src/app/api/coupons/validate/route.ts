import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/** Public coupon validation used by checkout. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();
    const code = String(body.code || "")
      .trim()
      .toUpperCase();
    const subtotal = Number(body.subtotal) || 0;
    const coupon = (db.coupons || []).find(
      (c: { code: string; active?: boolean }) => c.code === code && c.active !== false
    );
    if (!coupon) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 400 });
    }
    if (coupon.maxUses != null && Number(coupon.usedCount || 0) >= Number(coupon.maxUses)) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }
    let discount = 0;
    if (coupon.type === "percent") {
      discount = Math.round((subtotal * Number(coupon.value)) / 100);
    } else {
      discount = Number(coupon.value) || 0;
    }
    discount = Math.min(subtotal, Math.max(0, discount));
    return NextResponse.json({
      discount,
      code: coupon.code,
      message: `Saved ₹${discount.toFixed(0)}`,
    });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
