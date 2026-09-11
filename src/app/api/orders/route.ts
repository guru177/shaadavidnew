import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb, saveDb } from "@/lib/db";
import {
  decrementStockForItems,
  ensureUser,
  getOrderLineItems,
  restockItems,
} from "@/lib/orderFulfillment";
import { generateOrderId, renumberOrders } from "@/lib/ids";
import { getStockQty } from "@/lib/stock";
import { parseOrderDate } from "@/lib/dashboard";
import { calculateOrderShipping, orderGrandTotal } from "@/lib/shipping";

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.orders || []);
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const db = await getDb();

    if (!db.orders) db.orders = [];
    if (!db.users) db.users = [];
    if (!db.products) db.products = [];

    const address = orderData.address || orderData.shippingAddress;
    if (!address?.mobile || !address?.name) {
      return NextResponse.json({ error: "Shipping address required" }, { status: 400 });
    }

    let items = Array.isArray(orderData.items) ? orderData.items : null;
    if (!items?.length) {
      const product =
        (db.products || []).find((p: { id: string }) => p.id === orderData.productId) || null;
      if (!product || product.deletedAt) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const qty = Math.max(1, Number(orderData.qty) || 1);
      if (getStockQty(product) < qty) {
        return NextResponse.json({ error: "Out of stock" }, { status: 400 });
      }
      const unit = Number(product.price);
      items = [
        {
          productId: product.id,
          title: product.titleEn || product.title,
          qty,
          unitPrice: unit,
          amount: unit * qty,
        },
      ];
    } else {
      for (const line of items) {
        const product = (db.products || []).find((p: { id: string }) => p.id === line.productId);
        if (!product || product.deletedAt) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        const qty = Math.max(1, Number(line.qty) || 1);
        if (getStockQty(product) < qty) {
          return NextResponse.json({ error: "Out of stock" }, { status: 400 });
        }
        line.qty = qty;
        line.unitPrice = Number(product.price);
        line.amount = Number(product.price) * qty;
        line.title = product.titleEn || product.title;
      }
    }

    const paymentMethod = orderData.paymentMethod || "Manual";
    const isCod = paymentMethod === "COD";
    const isPaid =
      orderData.paymentStatus === "Paid" ||
      Boolean(orderData.razorpayPaymentId) ||
      (!isCod && paymentMethod === "Manual" && orderData.paymentStatus === "Paid");

    // Take stock for COD and paid orders at place-time
    if (isCod || isPaid || paymentMethod === "Manual") {
      decrementStockForItems(db, items);
    }

    const user = ensureUser(db, address);
    const subtotal =
      Number(orderData.subtotal) ||
      items.reduce((s: number, i: any) => s + Number(i.amount), 0);
    const discount = Number(orderData.discountValue) || 0;
    const tax = Number(orderData.taxAmount) || 0;
    const shippingCharge = calculateOrderShipping(db.products, items);
    const total = orderGrandTotal({ subtotal, discount, tax, shipping: shippingCharge });
    const primary = items[0];

    const newOrder = {
      id: generateOrderId(db),
      userId: user.id,
      customerDetails: {
        name: address.name,
        mobile: address.mobile,
        email: address.email || orderData.email || "",
      },
      shippingAddress: address,
      productId: primary.productId,
      product: items.map((i: any) => `${i.title} ×${i.qty}`).join(", "),
      items,
      qty: items.reduce((s: number, i: any) => s + i.qty, 0),
      subtotal,
      discountValue: discount,
      taxAmount: tax,
      shippingCharge,
      couponCode: orderData.couponCode || "",
      amount: `₹${total.toFixed(2)}`,
      amountValue: total,
      currency: "INR",
      status: orderData.status || (isCod ? "Confirmed" : "Pending"),
      paymentStatus: isCod ? "Unpaid" : orderData.paymentStatus || (isPaid ? "Paid" : "Pending"),
      paymentMethod,
      whatsappNotified: false,
      razorpayOrderId: orderData.razorpayOrderId || null,
      razorpayPaymentId: orderData.razorpayPaymentId || null,
      screenshotUrl: orderData.screenshotUrl || null,
      carrier: orderData.carrier || "",
      awb: orderData.awb || "",
      trackingUrl: orderData.trackingUrl || "",
      notes: orderData.notes || "",
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: new Date().toISOString(),
      stockCommitted: true,
    };

    db.orders.unshift(newOrder);
    await saveDb(db);

    try {
      const { sendOrderEmail } = await import("@/lib/email");
      await sendOrderEmail(newOrder, "confirmation");
    } catch {
      /* optional */
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to process order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      status,
      whatsappNotified,
      paymentStatus,
      carrier,
      awb,
      trackingUrl,
      notes,
      action,
    } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDb();
    if (!db.orders) db.orders = [];

    const index = db.orders.findIndex((o: { id: string }) => o.id === id);
    if (index === -1) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = db.orders[index];
    const prevStatus = order.status;

    if (action === "cancel" || status === "Cancelled") {
      if (order.status !== "Cancelled" && order.status !== "Refunded" && order.stockCommitted !== false) {
        restockItems(db, getOrderLineItems(order));
        order.stockCommitted = false;
      }
      order.status = "Cancelled";
      if (!order.paymentStatus || order.paymentStatus === "Paid") {
        // leave payment as-is unless refunding
      }
    } else if (action === "refund" || status === "Refunded") {
      if (order.status !== "Refunded" && order.stockCommitted !== false) {
        restockItems(db, getOrderLineItems(order));
        order.stockCommitted = false;
      }
      order.status = "Refunded";
      order.paymentStatus = "Refunded";
      order.refundedAt = order.refundedAt || new Date().toISOString();
      order.refundAmount =
        order.refundAmount != null ? Number(order.refundAmount) : Number(order.amountValue) || 0;
      order.refundStatus = order.refundStatus || "pending";

      // best-effort Razorpay refund
      if (order.razorpayPaymentId && !String(order.razorpayPaymentId).startsWith("pay_mock_")) {
        try {
          const { getRazorpayKeyId, getRazorpayKeySecret } = await import("@/lib/settings");
          const key_id = await getRazorpayKeyId();
          const key_secret = await getRazorpayKeySecret();
          if (key_id && key_secret) {
            const Razorpay = (await import("razorpay")).default;
            const rzp = new Razorpay({ key_id, key_secret });
            const refund = await rzp.payments.refund(order.razorpayPaymentId, {
              amount: Math.round(Number(order.amountValue) * 100),
            });
            order.refundId = refund?.id || order.refundId || null;
            order.refundStatus = refund?.status || "processed";
            if (refund?.amount != null) {
              order.refundAmount = Number(refund.amount) / 100;
            }
            order.refundError = null;
          } else {
            order.refundStatus = "skipped_no_keys";
          }
        } catch (err) {
          console.error("Razorpay refund failed", err);
          order.refundStatus = "failed";
          order.refundError = err instanceof Error ? err.message : "Refund API failed";
        }
      } else if (String(order.razorpayPaymentId || "").startsWith("pay_mock_")) {
        order.refundId = order.refundId || `rfnd_mock_${Date.now()}`;
        order.refundStatus = "processed";
      } else {
        order.refundStatus = order.refundStatus || "manual";
      }
    } else if (status != null) {
      order.status = status;
    }

    if (typeof whatsappNotified === "boolean") {
      order.whatsappNotified = whatsappNotified;
    }
    if (paymentStatus != null) order.paymentStatus = paymentStatus;
    if (carrier != null) order.carrier = carrier;
    if (awb != null) order.awb = awb;
    if (trackingUrl != null) order.trackingUrl = trackingUrl;
    if (notes != null) order.notes = notes;

    // Mark COD collected
    if (paymentStatus === "Paid" && order.paymentMethod === "COD" && !order.stockCommitted) {
      // already stocked at place
    }

    db.orders[index] = order;
    await saveDb(db);

    if (status && status !== prevStatus) {
      try {
        const { sendOrderEmail } = await import("@/lib/email");
        await sendOrderEmail(order, "status");
      } catch {
        /* optional */
      }
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids.map((id: unknown) => String(id)).filter(Boolean)
      : body.id
        ? [String(body.id)]
        : [];

    if (!ids.length) {
      return NextResponse.json({ error: "Order id(s) required" }, { status: 400 });
    }

    const db = await getDb();
    if (!db.orders) db.orders = [];

    const idSet = new Set(ids);
    const removed: string[] = [];

    db.orders = db.orders.filter((order: { id: string; stockCommitted?: boolean; status?: string }) => {
      if (!idSet.has(order.id)) return true;
      // Restore stock for orders that still have inventory committed
      if (order.stockCommitted !== false && order.status !== "Cancelled" && order.status !== "Refunded") {
        restockItems(db, getOrderLineItems(order));
      }
      removed.push(order.id);
      return false;
    });

    if (!removed.length) {
      return NextResponse.json({ error: "No matching orders found" }, { status: 404 });
    }

    // Compact remaining orders back to ORD-0001, ORD-0002, …
    db.orders = renumberOrders(db.orders, parseOrderDate);

    await saveDb(db);
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/users");
    return NextResponse.json({
      ok: true,
      removed,
      orders: db.orders,
      nextOrderId: generateOrderId(db),
    });
  } catch {
    return NextResponse.json({ error: "Failed to delete orders" }, { status: 500 });
  }
}
