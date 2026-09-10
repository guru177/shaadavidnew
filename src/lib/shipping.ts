/** Flat shipping fee from a product (not multiplied by qty). */
export function getProductShippingCharge(product: {
  shippingEnabled?: boolean;
  shippingCharge?: number | string;
} | null | undefined): number {
  if (!product || product.shippingEnabled !== true) return 0;
  const n = Math.max(0, Number(product.shippingCharge) || 0);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Sum shipping once per unique product in the order lines.
 * Reads live product records from `products` so clients cannot underpay.
 */
export function calculateOrderShipping(
  products: Array<{
    id?: string;
    shippingEnabled?: boolean;
    shippingCharge?: number | string;
  }> | null | undefined,
  lineItems: Array<{ productId?: string }> | null | undefined
): number {
  if (!Array.isArray(products) || !Array.isArray(lineItems) || !lineItems.length) return 0;
  const seen = new Set<string>();
  let total = 0;
  for (const line of lineItems) {
    const id = String(line?.productId || "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const product = products.find((p) => p?.id === id);
    total += getProductShippingCharge(product);
  }
  return Math.round(total * 100) / 100;
}

export function orderGrandTotal(opts: {
  subtotal: number;
  discount?: number;
  tax?: number;
  shipping?: number;
}): number {
  const subtotal = Math.max(0, Number(opts.subtotal) || 0);
  const discount = Math.max(0, Number(opts.discount) || 0);
  const tax = Math.max(0, Number(opts.tax) || 0);
  const shipping = Math.max(0, Number(opts.shipping) || 0);
  return Math.max(0, subtotal - discount + tax + shipping);
}
