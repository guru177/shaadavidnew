export type ProductSpecRow = { label: string; value: string };

export type ProductReview = {
  id: string;
  productId: string;
  name: string;
  title: string;
  date: string;
  content: string;
  rating: number;
  helpful: number;
  /** pending reviews stay off the storefront until approved */
  status: "pending" | "approved" | "rejected";
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  shortDescription: string;
  description: string;
  moreInfo: string;
  features: string[];
  price: number;
  mrp: number;
  discountPercent: number;
  currency: string;
  images: string[];
  rating: number;
  ratingCount: number;
  reviewCount: number;
  ratingBreakdown: { star: number; pct: number }[];
  bookDetails: ProductSpecRow[];
  dimensions: ProductSpecRow[];
  breadcrumbs: string[];
  /** Units available for sale */
  stock: number;
  /** Derived from stock > 0; kept for backwards compatibility */
  inStock: boolean;
  sku?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  variantLabel?: string;
  /** Soft-delete timestamp ISO */
  deletedAt?: string | null;
  featured?: boolean;
};

export type ShippingAddress = {
  name: string;
  mobile: string;
  pincode: string;
  flat: string;
  area: string;
  city: string;
  state: string;
};
