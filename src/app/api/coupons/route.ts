import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.coupons || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();
    if (!db.coupons) db.coupons = [];

    // Validate coupon (public)
    if (body.code && body.subtotal != null && !body.id) {
      const code = String(body.code).trim().toUpperCase();
      const coupon = db.coupons.find(
        (c: { code: string; active?: boolean }) => c.code === code && c.active !== false
      );
      if (!coupon) {
        return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 400 });
      }
      if (coupon.maxUses != null && Number(coupon.usedCount || 0) >= Number(coupon.maxUses)) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }
      const subtotal = Number(body.subtotal) || 0;
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
    }

    // Create coupon (admin — middleware protected)
    const code = String(body.code || "")
      .trim()
      .toUpperCase();
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });
    if (db.coupons.some((c: { code: string }) => c.code === code)) {
      return NextResponse.json({ error: "Coupon already exists" }, { status: 400 });
    }
    const coupon = {
      id: `cpn-${Date.now()}`,
      code,
      type: body.type === "percent" ? "percent" : "flat",
      value: Number(body.value) || 0,
      active: body.active !== false,
      maxUses: body.maxUses != null ? Number(body.maxUses) : null,
      usedCount: 0,
    };
    db.coupons.unshift(coupon);
    saveDb(db);
    return NextResponse.json(coupon, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Coupon failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();
    if (!db.coupons) db.coupons = [];
    const idx = db.coupons.findIndex((c: { id: string }) => c.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    db.coupons[idx] = { ...db.coupons[idx], ...body };
    saveDb(db);
    return NextResponse.json(db.coupons[idx]);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const db = getDb();
  db.coupons = (db.coupons || []).filter((c: { id: string }) => c.id !== id);
  saveDb(db);
  return NextResponse.json({ success: true });
}
