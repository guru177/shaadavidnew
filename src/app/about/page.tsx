import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AboutHero from "@/components/about/AboutHero";
import AboutPhilosophy from "@/components/about/AboutPhilosophy";
import AboutFounder from "@/components/about/AboutFounder";
import TestimonialSection from "@/components/home/TestimonialSection";

export const metadata = {
  title: 'About Us | Shaa David',
  description: 'Discover the story behind Shaa David and our revolutionary approach to mastering spoken English for Malayalis.',
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F9F9F9]">

      {/* Header wrapper to keep it clean */}
      <div className="relative z-50 w-full max-w-[1920px] mx-auto">
        <Header />
      </div>

      {/* Dynamic Sections */}
      <AboutHero />
      <AboutPhilosophy />
      <AboutFounder />

      {/* Why Choose Us & Footer integrated at the bottom */}
      <div className="relative z-20 w-full flex flex-col max-w-[1920px] mx-auto bg-white">
        <WhyChooseUs />
        <TestimonialSection />
        <Footer />
      </div>

    </main>
  );
}
