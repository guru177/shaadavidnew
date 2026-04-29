import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import ProductInfo from "@/components/product/ProductInfo";
import ProductMoreInfo from "@/components/product/ProductMoreInfo";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";

export const metadata = {
  title: 'Shaa David English Companion | Shaa David',
  description: 'The Ultimate Guide to Spoken English for Malayalis',
};

export default function ProductPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F1F3F6]">
      <div className="relative z-50 w-full max-w-[1920px] mx-auto bg-white">
        <Header />
      </div>

      <div className="w-full mx-auto bg-[#F1F3F6] pb-8 px-5 md:px-12 xl:px-20 2xl:px-32 pt-[120px]">

        {/* Main Content Wrapper - Elegant Curved Box */}
        <div className="bg-white flex flex-col lg:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] overflow-hidden border border-white">

          {/* Left Column: Images & Action Buttons */}
          <div className="w-full lg:w-[40%] flex flex-col p-4 border-r border-gray-100">
            <ProductGallery />
          </div>

          {/* Right Column: Product Details */}
          <div className="w-full lg:w-[60%] flex flex-col p-4 md:p-8">
            <ProductBreadcrumbs />
            <ProductInfo />
          </div>
        </div>

        {/* Full Width Sections Below Fold */}
        <div className="mt-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] px-6 py-12 md:p-16 border border-white">
          <ProductMoreInfo />

          <div className="w-full h-px bg-gray-100 my-16"></div>

          <ProductSpecifications />

          <div className="w-full h-px bg-gray-100 my-16"></div>

          <ProductReviewsSection />


        </div>
      </div>

      <Footer />
    </main>
  );
}
