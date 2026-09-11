import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import ProductInfo from "@/components/product/ProductInfo";
import ProductMoreInfo from "@/components/product/ProductMoreInfo";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import ProductVideoSection from "@/components/product/ProductVideoSection";
import type { Product, ProductReview } from "@/types/product";

type Props = {
  product: Product;
  reviews: ProductReview[];
};

export default function ProductDetailView({ product, reviews }: Props) {
  return (
    <>
      <Header />
      <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F1F3F6]">
        <div className="w-full max-w-[1920px] mx-auto bg-[#F1F3F6] pb-0 px-0 sm:px-5 md:px-8 xl:px-12 2xl:px-16 pt-[72px] md:pt-[80px] xl:pt-[84px]">
          <div className="bg-white flex flex-col lg:flex-row lg:items-start shadow-sm sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-none sm:rounded-[40px] overflow-hidden border-b sm:border border-gray-50">
            <div className="w-full lg:w-[40%] flex flex-col px-4 sm:px-5 md:px-6 pt-5 sm:pt-6 md:pt-7 pb-4 sm:pb-5 border-r border-gray-100">
              <ProductGallery images={product.images} title={product.titleEn} />
            </div>
            <div className="w-full lg:w-[60%] flex flex-col px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 md:pt-7 pb-6 md:pb-8">
              <ProductBreadcrumbs items={product.breadcrumbs} />
              <ProductInfo product={product} />
            </div>
          </div>

          <div className="bg-white shadow-sm sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-none sm:rounded-[40px] px-4 sm:px-6 py-8 sm:py-12 md:p-16 border-t sm:border border-gray-50 mb-0">
            <ProductMoreInfo moreInfo={product.moreInfo} features={product.features} />
            <div className="w-full h-px bg-gray-100 my-8 md:my-16" />
            <ProductSpecifications bookDetails={product.bookDetails} dimensions={product.dimensions} />
            <ProductVideoSection product={product} />
            <div className="w-full h-px bg-gray-100 my-8 md:my-16" />
            <ProductReviewsSection product={product} reviews={reviews} />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
