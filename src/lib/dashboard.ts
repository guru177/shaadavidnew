import { normalizeOrderStatus, type OrderStatus } from "@/lib/orders";

export type DashboardOrder = {
  id: string;
  product?: string;
  productId?: string;
  amount?: string;
  amountValue?: number;
  status?: string;
  paymentStatus?: string;
  date?: string;
  customerDetails?: { name?: string; mobile?: string };
  shippingAddress?: { name?: string; mobile?: string; city?: string; state?: string };
};

export type DashboardProduct = {
  id: string;
  titleEn?: string;
  title?: string;
  stock?: number;
  inStock?: boolean;
  price?: number | string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MONTH_ALIASES: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

export function parseOrderAmount(order: DashboardOrder): number {
  if (typeof order.amountValue === "number" && !Number.isNaN(order.amountValue)) {
    return order.amountValue;
  }
  const amount = parseFloat(String(order.amount || "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(amount) ? 0 : amount;
}

/** Parses dates like "8 Sept 2026, 10:42", "28 April 2026", ISO strings */
export function parseOrderDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const iso = Date.parse(dateStr);
  if (!Number.isNaN(iso)) return new Date(iso);

  const match = String(dateStr).match(
    /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})(?:[,\s]+(\d{1,2}):(\d{2}))?/
  );
  if (!match) return null;

  const day = Number(match[1]);
  const month = MONTH_ALIASES[match[2].toLowerCase()];
  const year = Number(match[3]);
  const hour = match[4] ? Number(match[4]) : 12;
  const minute = match[5] ? Number(match[5]) : 0;
  if (month == null || Number.isNaN(day) || Number.isNaN(year)) return null;
  return new Date(year, month, day, hour, minute);
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function labelMonth(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS[(m || 1) - 1]} ${String(y).slice(2)}`;
}

export function buildDashboardStats(
  orders: DashboardOrder[],
  products: DashboardProduct[],
  usersCount: number
) {
  const totalRevenue = orders.reduce((sum, o) => sum + parseOrderAmount(o), 0);
  const statusCounts: Record<string, number> = {
    Pending: 0,
    Confirmed: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
    Refunded: 0,
  };
  const paymentCounts: Record<string, number> = {};
  const productSales: Record<string, { name: string; orders: number; revenue: number }> = {};
  const cityCounts: Record<string, number> = {};

  let paidRevenue = 0;
  const dated: { date: Date; amount: number; status: string }[] = [];

  for (const order of orders) {
    const status = normalizeOrderStatus(order.status);
    statusCounts[status] += 1;

    const payment = order.paymentStatus || "Unknown";
    paymentCounts[payment] = (paymentCounts[payment] || 0) + 1;

    const amount = parseOrderAmount(order);
    if (payment === "Paid") paidRevenue += amount;

    const productName = order.product || "Unknown product";
    const productKey = order.productId || productName;
    if (!productSales[productKey]) {
      productSales[productKey] = { name: productName, orders: 0, revenue: 0 };
    }
    productSales[productKey].orders += 1;
    productSales[productKey].revenue += amount;

    const city = order.shippingAddress?.city?.trim() || "Unknown";
    cityCounts[city] = (cityCounts[city] || 0) + 1;

    const date = parseOrderDate(order.date);
    if (date) dated.push({ date, amount, status });
  }

  const now = new Date();
  const revenueByMonth: { key: string; label: string; revenue: number; orders: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d);
    revenueByMonth.push({ key, label: labelMonth(key), revenue: 0, orders: 0 });
  }
  const monthIndex = Object.fromEntries(revenueByMonth.map((m, i) => [m.key, i]));
  for (const item of dated) {
    const key = monthKey(item.date);
    const idx = monthIndex[key];
    if (idx == null) continue;
    revenueByMonth[idx].revenue += item.amount;
    revenueByMonth[idx].orders += 1;
  }

  const thisMonthKey = monthKey(now);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = monthKey(lastMonthDate);
  const thisMonth = revenueByMonth.find((m) => m.key === thisMonthKey);
  const lastMonth = revenueByMonth.find((m) => m.key === lastMonthKey);

  const revenueTrend = pctChange(thisMonth?.revenue || 0, lastMonth?.revenue || 0);
  const ordersTrend = pctChange(thisMonth?.orders || 0, lastMonth?.orders || 0);

  const statusPie = (Object.entries(statusCounts) as [OrderStatus, number][])
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const paymentPie = Object.entries(paymentCounts).map(([name, value]) => ({ name, value }));

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)
    .map((p) => ({
      name: p.name.length > 28 ? `${p.name.slice(0, 26)}…` : p.name,
      fullName: p.name,
      orders: p.orders,
      revenue: p.revenue,
    }));

  const topCities = Object.entries(cityCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const lowStock = products
    .map((p) => ({
      id: p.id,
      name: p.titleEn || p.title || p.id,
      stock: typeof p.stock === "number" ? p.stock : null,
    }))
    .filter((p): p is { id: string; name: string; stock: number } => p.stock != null && p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const pendingCount = statusCounts.Pending;
  const confirmedCount = statusCounts.Confirmed;
  const shippedCount = statusCounts.Shipped;
  const deliveredCount = statusCounts.Delivered;

  return {
    totalRevenue,
    paidRevenue,
    avgOrderValue,
    totalOrders: orders.length,
    pendingCount,
    confirmedCount,
    shippedCount,
    deliveredCount,
    usersCount,
    revenueTrend,
    ordersTrend,
    revenueByMonth,
    statusPie,
    paymentPie,
    topProducts,
    topCities,
    lowStock,
    recentOrders: orders.slice(0, 8),
  };
}

function pctChange(current: number, previous: number): { label: string; positive: boolean } {
  if (previous === 0) {
    if (current === 0) return { label: "0%", positive: true };
    return { label: "+100%", positive: true };
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  const positive = pct >= 0;
  return { label: `${positive ? "+" : ""}${pct}%`, positive };
}
