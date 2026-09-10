import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getDb } from "@/lib/db";
import { metadataForSeoPage } from "@/lib/seo";
import { normalizeGalleryItems } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return await metadataForSeoPage("gallery");
}

export default async function GalleryPage() {
  const db = await getDb();
  const galleryItems = normalizeGalleryItems(db.gallery || []);
  const heroBg =
    galleryItems.find((item) => item.type === "image")?.url || "/blog-bg.webp";

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <Header />

      <div className="w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] relative overflow-hidden flex items-center justify-center text-center px-4 pt-36 sm:pt-40 md:pt-44 lg:pt-48">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg}
            alt="Gallery Background"
            fill
            className="object-cover opacity-50 grayscale-[10%]"
            priority
            unoptimized={heroBg.startsWith("http")}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1622] via-[#0c1622]/90 to-[#1a2c42]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
        </div>

        <div
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#395c80] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse z-0" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 z-0" />

        <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-12 sm:pb-16 lg:pb-24 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-5 sm:mb-8 tracking-normal font-malayalam-display drop-shadow-lg leading-[1.45] sm:leading-[1.65] overflow-visible py-1 sm:py-2">
            ഞങ്ങളുടെ ഗാലറി
          </h1>
          <p className="text-white/90 text-base sm:text-xl max-w-3xl mx-auto leading-[1.75] font-medium font-malayalam drop-shadow-md px-2">
            ക്ലാസുകളും നിമിഷങ്ങളും നേട്ടങ്ങളും — ഇംഗ്ലീഷ് പഠനം എല്ലാവർക്കും ലഭ്യമാക്കാനുള്ള ഞങ്ങളുടെ യാത്രയിലെ ചിത്രങ്ങളും വീഡിയോകളും.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 pb-32 relative z-10">
        <GalleryGrid initialItems={galleryItems} />
      </div>

      <Footer />
    </main>
  );
}
