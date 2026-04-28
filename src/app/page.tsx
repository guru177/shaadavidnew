import Image from "next/image";
import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import TextSlider from "@/components/home/TextSlider";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F9F9F9]">
      {/* First Screen Wrapper (Hero Section) */}
      <div className="relative z-10 w-full flex flex-col min-h-screen xl:h-screen max-w-[1920px] mx-auto overflow-hidden">
        {/* Background Split - Now absolute to this container so it scrolls with the page */}
        <div className="absolute inset-0 flex z-0 pointer-events-none">
          <div className="w-full xl:w-[62%] h-full bg-[#FAFAFA]"></div>
          <div className="hidden xl:block w-[38%] h-full bg-[#353941] rounded-l-[40px] shadow-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col flex-1">
          <Header />
          <HeroSection />
        </div>
      </div>

      {/* Next Sections */}
      <div className="relative z-20 w-full flex flex-col max-w-[1920px] mx-auto bg-white">
        <TextSlider />
      </div>
    </main>
  );
}
