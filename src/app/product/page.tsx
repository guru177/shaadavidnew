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

      <div className="w-full max-w-[1920px] mx-auto bg-[#F1F3F6] pt-4 pb-8 px-2 md:px-4 lg:px-8">
        
        {/* Main Content Wrapper - White Box like Flipkart */}
        <div className="bg-white flex flex-col lg:flex-row shadow-sm rounded-sm">
          
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
        <div className="mt-8 bg-white shadow-sm rounded-sm px-6 py-12 md:p-16">
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
