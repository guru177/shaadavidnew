import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";

// Dynamically import below-the-fold components to reduce initial bundle size
const TextSlider = dynamic(() => import('@/components/home/TextSlider'));
const AboutSection = dynamic(() => import('@/components/home/AboutSection'));
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'));
const ProductSection = dynamic(() => import('@/components/home/ProductSection'));
const BlogSection = dynamic(() => import('@/components/home/BlogSection'));
const TestimonialSection = dynamic(() => import('@/components/home/TestimonialSection'));

export const metadata = {
  title: 'Shaa David | Learn English Through Malayalam',
  description: 'The complete guide to learning English easily through Malayalam. Speak confidently without fear of grammar. Master English with Shaa David.',
  keywords: ['Learn English', 'Malayalam to English', 'Shaa David', 'Spoken English Malayalam', 'English Grammar Malayalam'],
  openGraph: {
    title: 'Shaa David | Learn English Through Malayalam',
    description: 'The complete guide to learning English easily through Malayalam. Speak confidently without fear of grammar.',
    images: ['/hero-graphic.webp'],
  }
};

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F9F9F9]">
      <Header />
      
      {/* First Screen Wrapper (Hero Section) */}
      <div className="relative z-30 w-full flex flex-col min-h-screen xl:h-screen max-w-[1920px] mx-auto overflow-hidden">
        {/* Background Split - Now absolute to this container so it scrolls with the page */}
        <div className="absolute inset-0 flex z-0 pointer-events-none">
          <div className="w-full xl:w-[62%] h-full bg-[#FAFAFA]"></div>
          <div className="hidden xl:block w-[38%] h-full bg-[linear-gradient(135deg,#0c1622_0%,#29425e_100%)] rounded-l-[40px] shadow-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col flex-1 pt-24 md:pt-0">
          <HeroSection />
        </div>
      </div>


      {/* Next Sections */}
      <div className="relative z-20 w-full flex flex-col max-w-[1920px] mx-auto bg-white">
        <TextSlider />
        <AboutSection />
        <WhyChooseUs />
        <ProductSection />
        <BlogSection />
        <TestimonialSection />
        <Footer />
      </div>
    </main>
  );
}
