import type { ProductPreviewPage } from "@/types/product";

/** Built-in flip-book pages, used until a product's preview pages are saved from admin. */
export const DEFAULT_PREVIEW_PAGES: ProductPreviewPage[] = [
  { src: "/book-preview/cover-front.jpg", label: "Front cover" },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 52, 58, 102, 166, 206, 302, 431, 539, 552, 563].map((n) => ({
    src: `/book-preview/page-${n}.jpg`,
    label: `Page ${n}`,
  })),
  { src: "/book-preview/cover-back.jpg", label: "Back cover" },
];

/** Pages to show for a product: saved list (possibly empty = hidden) or the built-in default. */
export function getProductPreviewPages(product: { previewPages?: ProductPreviewPage[] }) {
  return Array.isArray(product.previewPages) ? product.previewPages : DEFAULT_PREVIEW_PAGES;
}

/** Sanitises preview pages from a request body: keeps entries with an image URL, trims labels. */
export function normalizePreviewPages(raw: unknown): ProductPreviewPage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const item = entry as Record<string, unknown>;
      const src = typeof item.src === "string" ? item.src.trim() : "";
      if (!src) return null;
      const label = typeof item.label === "string" ? item.label.trim() : "";
      return { src, label };
    })
    .filter((p): p is ProductPreviewPage => p !== null);
}
