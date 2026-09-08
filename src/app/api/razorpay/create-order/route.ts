import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getDb, saveDb } from "@/lib/db";
import { addPendingPayment, getStockQty } from "@/lib/stock";
import {
  getRazorpayKeyId,
  getRazorpayKeySecret,
  isRazorpayLocalMock,
} from "@/lib/settings";

function getRazorpay() {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();
  if (!key_id || !key_secret || isRazorpayLocalMock()) return null;
  return new Razorpay({ key_id, key_secret });
}

export async function POST(request: Request) {
  try {
    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "Razorpay is not configured. Add keys in Admin → Settings or .env.local",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      productId,
      qty = 1,
      items,
      address,
      couponCode,
      discountValue = 0,
      taxAmount = 0,
    } = body;

    const db = getDb();
    let lineItems = Array.isArray(items) ? items : null;
    let amountPaise = 0;
    let currency = "INR";
    let productPayload: any = null;

    if (lineItems && lineItems.length > 0) {
      const lines = lineItems;
      for (const line of lines) {
        const product = (db.products || []).find((p: { id: string }) => p.id === line.productId);
        if (!product || product.deletedAt) {
          return NextResponse.json({ error: `Product not found: ${line.productId}` }, { status: 404 });
        }
        const q = Math.max(1, Number(line.qty) || 1);
        if (getStockQty(product) < q) {
          return NextResponse.json({ error: `${product.titleEn || product.title} is out of stock` }, { status: 400 });
        }
        const unit = Number(product.price);
        line.qty = q;
        line.unitPrice = unit;
        line.amount = unit * q;
        line.title = product.titleEn || product.title;
        amountPaise += Math.round(unit * q * 100);
        currency = product.currency || currency;
      }
      const primary = lines[0];
      productPayload = {
        id: primary.productId,
        title: lines.map((i: any) => `${i.title} ×${i.qty}`).join(", "),
        price: amountPaise / 100,
        image: (db.products || []).find((p: any) => p.id === primary.productId)?.images?.[0],
      };
    } else {
      const product = (db.products || []).find((p: { id: string }) => p.id === productId);
      if (!product || product.deletedAt) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const q = Math.max(1, Number(qty) || 1);
      if (getStockQty(product) < q) {
        return NextResponse.json({ error: "Product out of stock" }, { status: 400 });
      }
      amountPaise = Math.round(Number(product.price) * q * 100);
      currency = product.currency || "INR";
      lineItems = [
        {
          productId: product.id,
          title: product.titleEn || product.title,
          qty: q,
          unitPrice: Number(product.price),
          amount: Number(product.price) * q,
        },
      ];
      productPayload = {
        id: product.id,
        title: product.titleEn || product.title,
        price: product.price,
        image: product.images?.[0],
      };
    }

    const discountPaise = Math.round(Number(discountValue) * 100) || 0;
    const taxPaise = Math.round(Number(taxAmount) * 100) || 0;
    amountPaise = Math.max(100, amountPaise - discountPaise + taxPaise);

    const notes: Record<string, string> = {
      productId: lineItems[0].productId,
      productName: lineItems[0].title,
      qty: String(lineItems[0].qty),
    };

    let orderId = "";
    let mock = false;

    if (isRazorpayLocalMock()) {
      orderId = `order_mock_${Date.now()}`;
      mock = true;
    } else {
      const razorpay = getRazorpay();
      if (!razorpay) {
        return NextResponse.json({ error: "Razorpay is not configured" }, { status: 503 });
      }
      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes,
      });
      orderId = order.id;
    }

    if (address) {
      addPendingPayment(db, {
        razorpayOrderId: orderId,
        productId: lineItems[0].productId,
        qty: lineItems[0].qty,
        items: lineItems,
        address,
        couponCode: couponCode || "",
        discountValue: Number(discountValue) || 0,
        taxAmount: Number(taxAmount) || 0,
        subtotal: lineItems.reduce((s: number, i: any) => s + i.amount, 0),
      });
      saveDb(db);
    }

    return NextResponse.json({
      orderId,
      amount: amountPaise,
      currency,
      keyId,
      mock,
      product: productPayload,
      items: lineItems,
    });
  } catch (error) {
    console.error("Razorpay create order failed:", error);
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
