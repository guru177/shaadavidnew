import { applyTemplate } from "@/lib/template";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/types/settings";

export type OrderLike = {
  id: string;
  status?: string;
  date?: string;
  amount?: string;
  product?: string;
  paymentStatus?: string;
  customerDetails?: { name?: string; mobile?: string };
  shippingAddress?: {
    name?: string;
    mobile?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
};

export const ORDER_STATUS_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUS_STEPS)[number];

/** Map legacy "Verified" → "Confirmed" */
export function normalizeOrderStatus(status?: string): string {
  if (status === "Verified") return "Confirmed";
  if (
    status === "Confirmed" ||
    status === "Pending" ||
    status === "Shipped" ||
    status === "Delivered" ||
    status === "Cancelled" ||
    status === "Refunded"
  ) {
    return status;
  }
  return "Pending";
}

export function parseOrderDate(value?: string): number {
  if (!value) return 0;
  const iso = Date.parse(value);
  if (Number.isFinite(iso)) return iso;
  const cleaned = value.replace(",", "");
  const t = Date.parse(cleaned);
  return Number.isFinite(t) ? t : 0;
}

export function normalizeMobile(mobile: string): string {
  const digits = String(mobile || "").replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits.slice(-10);
}

export function mobilesMatch(a: string, b: string): boolean {
  const na = normalizeMobile(a);
  const nb = normalizeMobile(b);
  return Boolean(na && nb && na === nb);
}

export function toWhatsAppNumber(mobile: string): string {
  const local = normalizeMobile(mobile);
  return local.length === 10 ? `91${local}` : local;
}

export function getOrderCustomerMobile(order: OrderLike): string {
  return order.shippingAddress?.mobile || order.customerDetails?.mobile || "";
}

export function getOrderCustomerName(order: OrderLike): string {
  return order.shippingAddress?.name || order.customerDetails?.name || "Customer";
}

export function statusLabel(status?: string): string {
  switch (normalizeOrderStatus(status)) {
    case "Pending":
      return "Pending confirmation";
    case "Confirmed":
      return "Confirmed";
    case "Shipped":
      return "Shipped";
    case "Delivered":
      return "Delivered";
    case "Cancelled":
      return "Cancelled";
    case "Refunded":
      return "Refunded";
    default:
      return status || "Unknown";
  }
}

type NotifyOptions = {
  siteUrl?: string;
  settings?: SiteSettings;
};

export function buildOrderStatusMessage(order: OrderLike, options?: NotifyOptions | string): string {
  // Back-compat: second arg used to be siteUrl string
  const opts: NotifyOptions =
    typeof options === "string" ? { siteUrl: options } : options || {};
  const settings = opts.settings || DEFAULT_SETTINGS;
  const baseUrl = (opts.siteUrl || settings.siteUrl || "http://localhost:3000").replace(/\/$/, "");
  const name = getOrderCustomerName(order);
  const status = statusLabel(order.status);
  const trackUrl = `${baseUrl}/track?order=${encodeURIComponent(order.id)}`;
  const normalized = normalizeOrderStatus(order.status);

  const templates = settings.whatsappTemplates;
  const byStatus: Record<string, string | undefined> = {
    Pending: templates.pending,
    Confirmed: templates.confirmed,
    Shipped: templates.shipped,
    Delivered: templates.delivered,
    Cancelled: templates.cancelled,
    Refunded: templates.refunded,
  };

  const template =
    byStatus[normalized] ||
    templates.orderStatus ||
    DEFAULT_SETTINGS.whatsappTemplates.confirmed;

  return applyTemplate(template, {
    name,
    orderId: order.id,
    status,
    productLine: order.product ? `Product: ${order.product}` : "",
    amountLine: order.amount ? `Amount: ${order.amount}` : "",
    trackUrl,
    siteName: settings.siteName,
    signature: templates.signature || DEFAULT_SETTINGS.whatsappTemplates.signature,
  })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildWhatsAppNotifyUrl(
  order: OrderLike,
  options?: NotifyOptions | string
): string | null {
  const mobile = getOrderCustomerMobile(order);
  if (!mobile) return null;
  const phone = toWhatsAppNumber(mobile);
  if (phone.length < 10) return null;
  const text = encodeURIComponent(buildOrderStatusMessage(order, options));
  return `https://wa.me/${phone}?text=${text}`;
}

export function statusStepIndex(status?: string): number {
  const n = normalizeOrderStatus(status);
  if (n === "Cancelled" || n === "Refunded") return -1;
  return ORDER_STATUS_STEPS.indexOf(n as (typeof ORDER_STATUS_STEPS)[number]);
}
