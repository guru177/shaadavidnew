import { cache } from "react";
import { getDb } from "@/lib/db";
import type { Product, ProductReview } from "@/types/product";

export { getStockQty, isProductInStock } from "@/lib/stock";

/** Dedupes product DB reads within a single request (metadata + page). */
export const getActiveProducts = cache(async (): Promise<Product[]> => {
  const db = await getDb();
  return (db.products || []).filter((p: Product) => !p.deletedAt);
});

export const getDefaultProduct = cache(async (): Promise<Product | null> => {
  const products = await getActiveProducts();
  return products.find((p) => p.featured) || products[0] || null;
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const needle = String(slug || "").trim().toLowerCase();
  if (!needle) return null;
  return (
    (await getActiveProducts()).find(
      (p: Product) => String(p.slug || "").trim().toLowerCase() === needle
    ) || null
  );
});

export const getProductReviews = cache(async (productId: string): Promise<ProductReview[]> => {
  const db = await getDb();
  return (db.reviews || []).filter(
    (r: ProductReview) =>
      r.productId === productId && (!r.status || r.status === "approved")
  );
});

/** Recompute rating stats from approved reviews and persist on product. */
export function recomputeProductRatings(db: any, productId: string) {
  if (!db.products) return;
  const idx = db.products.findIndex((p: Product) => p.id === productId);
  if (idx === -1) return;

  const approved = (db.reviews || []).filter(
    (r: ProductReview) =>
      r.productId === productId && (!r.status || r.status === "approved")
  );

  const count = approved.length;
  if (!count) {
    db.products[idx] = {
      ...db.products[idx],
      rating: 0,
      ratingCount: 0,
      reviewCount: 0,
      ratingBreakdown: [5, 4, 3, 2, 1].map((star) => ({ star, pct: 0 })),
    };
    return;
  }

  const sum = approved.reduce((s: number, r: ProductReview) => s + (Number(r.rating) || 0), 0);
  const avg = Math.round((sum / count) * 10) / 10;
  const buckets: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  approved.forEach((r: ProductReview) => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 0)));
    buckets[star] += 1;
  });

  db.products[idx] = {
    ...db.products[idx],
    rating: avg,
    ratingCount: count,
    reviewCount: count,
    ratingBreakdown: [5, 4, 3, 2, 1].map((star) => ({
      star,
      pct: Math.round((buckets[star] / count) * 100),
    })),
  };
}
