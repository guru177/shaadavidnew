import { notFound } from "next/navigation";
import ProductDetailView from "@/components/product/ProductDetailView";
import {
  getActiveProducts,
  getProductBySlug,
  getProductReviews,
} from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** Cache product HTML at the edge; refresh from Neon periodically. */
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products = await getActiveProducts();
    return products
      .filter((p) => p.slug)
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };

  const title = product.seoTitle || product.titleEn || product.title;
  const description =
    product.seoDescription ||
    product.shortDescription ||
    `Buy ${product.titleEn || product.title} from Shaa David's Academy.`;

  return await buildPageMetadata({
    title,
    description,
    keywords: product.seoKeywords,
    path: `/product/${product.slug}`,
    image: product.images?.[0],
  });
}

export default async function ProductSlugPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const reviews = await getProductReviews(product.id);

  return <ProductDetailView product={product} reviews={reviews} />;
}
