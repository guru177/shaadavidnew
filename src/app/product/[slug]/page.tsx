import { notFound } from "next/navigation";
import ProductDetailView from "@/components/product/ProductDetailView";
import { getProductBySlug, getProductReviews } from "@/lib/products";
import { getPrimaryImage } from "@/lib/media";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** Always read live product data (avoids cached 404 after admin deletes/restores). */
export const dynamic = "force-dynamic";
export const dynamicParams = true;

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
    image: getPrimaryImage(product.images),
  });
}

export default async function ProductSlugPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const reviews = await getProductReviews(product.id);

  return <ProductDetailView product={product} reviews={reviews} />;
}
