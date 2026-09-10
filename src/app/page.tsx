import nextDynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import { metadataForSeoPage } from "@/lib/seo";

/** Admin product/price edits must show immediately (same as /product/[slug]). */
export const dynamic = "force-dynamic";

// Dynamically import below-the-fold components to reduce initial bundle size
const TextSlider = nextDynamic(() => import("@/components/home/TextSlider"));
const AboutSection = nextDynamic(() => import("@/components/home/AboutSection"));
const WhyChooseUs = nextDynamic(() => import("@/components/home/WhyChooseUs"));
const ProductSection = nextDynamic(() => import("@/components/home/ProductSection"));
const BlogSection = nextDynamic(() => import("@/components/home/BlogSection"));
const InstagramSection = nextDynamic(() => import("@/components/home/InstagramSection"));
const VideoSection = nextDynamic(() => import("@/components/home/VideoSection"));
const TestimonialSection = nextDynamic(() => import("@/components/home/TestimonialSection"));

export async function generateMetadata() {
  return await metadataForSeoPage("home");
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F9F9F9]">
      
      {/* First Screen: header clearance + hero + strip = 100vh on desktop */}
      <div className="relative z-30 w-full flex flex-col min-h-screen xl:h-screen max-w-[1920px] mx-auto overflow-hidden">
        {/* Background Split */}
        <div className="absolute inset-0 flex z-0 pointer-events-none">
          <div className="w-full xl:w-[62%] h-full bg-[#FAFAFA]"></div>
          <div className="hidden xl:block w-[38%] h-full bg-[linear-gradient(135deg,#0c1622_0%,#29425e_100%)] rounded-l-[40px] shadow-2xl"></div>
        </div>

        {/* Hero content — tight under fixed header */}
        <div className="relative z-10 w-full flex flex-col flex-1 min-h-0 pt-[88px] md:pt-[100px] xl:pt-[96px] 2xl:pt-[108px]">
          <HeroSection />
        </div>

        {/* Marquee strip locked to bottom of first viewport */}
        <div className="relative z-40 w-full shrink-0 mt-auto">
          <TextSlider />
        </div>
      </div>

      {/* Next Sections */}
      <div className="relative z-20 w-full flex flex-col max-w-[1920px] mx-auto bg-white">
        <AboutSection />
        <WhyChooseUs />
        <ProductSection />
        <BlogSection />
        <InstagramSection />
        <VideoSection />
        <TestimonialSection />
        <Footer />
      </div>
      </main>
    </>
  );
}
