import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import ProductInfo from "@/components/product/ProductInfo";
import ProductMoreInfo from "@/components/product/ProductMoreInfo";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import { getDefaultProduct, getProductBySlug, getProductReviews } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product | Shaa David" };
  return {
    title: product.seoTitle || `${product.titleEn} | Shaa David`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.seoTitle || product.titleEn,
      description: product.seoDescription || product.shortDescription,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductSlugPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const reviews = getProductReviews(product.id);

  return (
    <>
      <Header />
      <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F1F3F6]">
        <div className="w-full max-w-[1920px] mx-auto bg-white pb-0 px-0 sm:px-5 md:px-8 xl:px-12 2xl:px-16 pt-[120px] md:pt-[160px]">
          <div className="bg-white flex flex-col lg:flex-row shadow-sm sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-none sm:rounded-[40px] overflow-hidden border-b sm:border border-gray-50">
            <div className="w-full lg:w-[40%] flex flex-col p-4 border-r border-gray-100">
              <ProductGallery images={product.images} title={product.titleEn} />
            </div>
            <div className="w-full lg:w-[60%] flex flex-col p-6 md:p-8">
              <ProductBreadcrumbs items={product.breadcrumbs} />
              <ProductInfo product={product} />
            </div>
          </div>

          <div className="bg-white shadow-sm sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-none sm:rounded-[40px] px-6 py-12 md:p-16 border-t sm:border border-gray-50">
            <ProductMoreInfo moreInfo={product.moreInfo} features={product.features} />
            <div className="w-full h-px bg-gray-100 my-16" />
            <ProductSpecifications bookDetails={product.bookDetails} dimensions={product.dimensions} />
            <div className="w-full h-px bg-gray-100 my-16" />
            <ProductReviewsSection product={product} reviews={reviews} />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

/** Legacy /product → featured slug */
export function LegacyProductRedirect() {
  const product = getDefaultProduct();
  if (product?.slug) redirect(`/product/${product.slug}`);
  redirect("/shop");
}
