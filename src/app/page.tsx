import Image from "next/image";
import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <main className="relative min-h-screen xl:h-screen w-full flex overflow-x-hidden xl:overflow-hidden font-sans bg-[#F9F9F9]">
      {/* Background Split */}
      <div className="fixed inset-0 flex z-0">
        <div className="w-full xl:w-[62%] h-full bg-[#FAFAFA]"></div>
        <div className="hidden xl:block w-[38%] h-full bg-[#353941] rounded-l-[40px] shadow-2xl"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full flex flex-col min-h-screen xl:min-h-0 xl:h-screen max-w-[1920px] mx-auto">

        <Header />

        {/* Hero Section */}
        <HeroSection />
      </div>
    </main>
  );
}
