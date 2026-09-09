import { redirect } from "next/navigation";
import ProductDetailView from "@/components/product/ProductDetailView";
import { getDefaultProduct, getProductReviews } from "@/lib/products";
import { getPrimaryImage } from "@/lib/media";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  const product = await getDefaultProduct();
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

/** Render the featured product here — no extra redirect round-trip. */
export default async function ProductIndexPage() {
  const product = await getDefaultProduct();
  if (!product?.slug) redirect("/shop");

  const reviews = await getProductReviews(product.id);
  return <ProductDetailView product={product} reviews={reviews} />;
}
