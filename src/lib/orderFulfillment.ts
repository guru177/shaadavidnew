import { getDb, saveDb } from "@/lib/db";
import { getStockQty } from "@/lib/stock";
import { generateOrderId, generateUserId } from "@/lib/ids";
import { calculateOrderShipping, orderGrandTotal } from "@/lib/shipping";

export type OrderLineItem = {
  productId: string;
  title: string;
  qty: number;
  unitPrice: number;
  amount: number;
};

export type FulfillAddress = {
  name: string;
  mobile: string;
  pincode: string;
  flat: string;
  area: string;
  city: string;
  state: string;
};

export type FulfillPaidInput = {
  items: OrderLineItem[];
  address: FulfillAddress;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  couponCode?: string;
  discountValue?: number;
  taxAmount?: number;
  shippingCharge?: number;
  subtotal?: number;
  notes?: string;
};

function formatOrderDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ensureUser(db: any, address: FulfillAddress) {
  if (!db.users) db.users = [];
  let user = db.users.find((u: { mobile: string }) => u.mobile === address.mobile);
  if (!user) {
    user = {
      id: generateUserId(db),
      name: address.name,
      mobile: address.mobile,
      location: `${address.city}, ${address.state}`,
      registeredDate: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      role: "customer",
    };
    db.users.unshift(user);
  }
  return user;
}

export function decrementStockForItems(db: any, items: OrderLineItem[]) {
  if (!db.products) db.products = [];
  for (const item of items) {
    const idx = db.products.findIndex((p: { id: string }) => p.id === item.productId);
    if (idx === -1) throw new Error(`Product not found: ${item.productId}`);
    const product = db.products[idx];
    const stock = getStockQty(product);
    if (stock < item.qty) throw new Error(`Insufficient stock for ${item.title}`);
    const next = stock - item.qty;
    db.products[idx] = { ...product, stock: next, inStock: next > 0 };
  }
}

export function restockItems(db: any, items: OrderLineItem[]) {
  if (!db.products) db.products = [];
  for (const item of items) {
    const idx = db.products.findIndex((p: { id: string }) => p.id === item.productId);
    if (idx === -1) continue;
    const product = db.products[idx];
    const next = getStockQty(product) + Math.max(1, item.qty || 1);
    db.products[idx] = { ...product, stock: next, inStock: next > 0 };
  }
}

export function getOrderLineItems(order: any): OrderLineItem[] {
  if (Array.isArray(order.items) && order.items.length) {
    return order.items.map((i: any) => ({
      productId: i.productId,
      title: i.title,
      qty: Number(i.qty) || 1,
      unitPrice: Number(i.unitPrice) || 0,
      amount: Number(i.amount) || Number(i.unitPrice) || 0,
    }));
  }
  if (order.productId) {
    const unit = Number(order.amountValue) || 0;
    const qty = Number(order.qty) || 1;
    return [
      {
        productId: order.productId,
        title: order.product || "Product",
        qty,
        unitPrice: unit / qty,
        amount: unit,
      },
    ];
  }
  return [];
}

/** Create paid/confirmed order idempotently by razorpayPaymentId. */
export async function fulfillPaidOrder(input: FulfillPaidInput) {
  const db = await getDb();
  if (!db.orders) db.orders = [];
  if (!db.products) db.products = [];

  if (input.razorpayPaymentId) {
    const existing = db.orders.find(
      (o: { razorpayPaymentId?: string }) => o.razorpayPaymentId === input.razorpayPaymentId
    );
    if (existing) return { order: existing, created: false };
  }

  if (!input.items?.length) throw new Error("No line items");

  const user = ensureUser(db, input.address);
  decrementStockForItems(db, input.items);

  const subtotal =
    input.subtotal ??
    input.items.reduce((s, i) => s + (Number(i.amount) || Number(i.unitPrice) * i.qty), 0);
  const discount = Number(input.discountValue) || 0;
  const tax = Number(input.taxAmount) || 0;
  const shippingCharge =
    input.shippingCharge != null
      ? Math.max(0, Number(input.shippingCharge) || 0)
      : calculateOrderShipping(db.products, input.items);
  const total = orderGrandTotal({ subtotal, discount, tax, shipping: shippingCharge });
  const primary = input.items[0];

  const order = {
    id: generateOrderId(db),
    userId: user.id,
    customerDetails: {
      name: input.address.name,
      mobile: input.address.mobile,
    },
    shippingAddress: input.address,
    productId: primary.productId,
    product: input.items.map((i) => `${i.title} ×${i.qty}`).join(", "),
    items: input.items,
    qty: input.items.reduce((s, i) => s + i.qty, 0),
    subtotal,
    discountValue: discount,
    taxAmount: tax,
    shippingCharge,
    couponCode: input.couponCode || "",
    amount: `₹${total.toFixed(2)}`,
    amountValue: total,
    currency: "INR",
    status: input.status || "Confirmed",
    paymentStatus: input.paymentStatus || "Paid",
    paymentMethod: input.paymentMethod || "Razorpay",
    whatsappNotified: false,
    razorpayOrderId: input.razorpayOrderId || null,
    razorpayPaymentId: input.razorpayPaymentId || null,
    carrier: "",
    awb: "",
    trackingUrl: "",
    notes: input.notes || "",
    date: formatOrderDate(),
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(order);

  // clear matching pending payment
  if (db.pendingPayments && input.razorpayOrderId) {
    db.pendingPayments = db.pendingPayments.filter(
      (p: { razorpayOrderId?: string }) => p.razorpayOrderId !== input.razorpayOrderId
    );
  }

  await saveDb(db);
  return { order, created: true };
}
