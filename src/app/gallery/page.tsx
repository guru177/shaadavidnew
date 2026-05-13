import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata = {
  title: 'Gallery | Shaa David',
  description: 'Explore moments and memories from Shaa David\'s English Companion journey.',
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F9F9F9] pt-24 md:pt-[120px] xl:pt-[160px]">
        
        {/* Page Header */}
        <div className="w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer mb-6">
              Our Gallery
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium">
              Explore some of our beautiful moments, classes, and achievements in our journey to make English learning accessible.
            </p>
          </div>
        </div>

        {/* Gallery Grid Container */}
        <div className="w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 pb-20 md:pb-32">
          <GalleryGrid />
        </div>

        <Footer />
      </main>
    </>
  );
}
