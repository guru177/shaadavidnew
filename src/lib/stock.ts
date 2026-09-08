import type { Product } from "@/types/product";

/** Normalize stock quantity (supports legacy inStock-only records). */
export function getStockQty(product: Pick<Product, "stock" | "inStock"> | null | undefined): number {
  if (!product) return 0;
  const qty = Number(product.stock);
  if (Number.isFinite(qty)) return Math.max(0, Math.floor(qty));
  return product.inStock === false ? 0 : 1;
}

export function isProductInStock(product: Pick<Product, "stock" | "inStock"> | null | undefined): boolean {
  return getStockQty(product) > 0;
}

const PENDING_TTL_MS = 1000 * 60 * 45; // 45 minutes

/** Drop stale pending payments (does not restock — stock is only taken on fulfill). */
export function prunePendingPayments(db: any) {
  if (!Array.isArray(db.pendingPayments)) {
    db.pendingPayments = [];
    return;
  }
  const now = Date.now();
  db.pendingPayments = db.pendingPayments.filter((p: { createdAt?: string }) => {
    const t = p.createdAt ? Date.parse(p.createdAt) : 0;
    return t && now - t < PENDING_TTL_MS;
  });
}

export function addPendingPayment(db: any, entry: Record<string, unknown>) {
  prunePendingPayments(db);
  if (!db.pendingPayments) db.pendingPayments = [];
  db.pendingPayments.unshift({ ...entry, createdAt: new Date().toISOString() });
}
