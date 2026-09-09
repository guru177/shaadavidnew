import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServiceHero from "../../components/services/ServiceHero";
import ServiceCounseling from "../../components/services/ServiceCounseling";
import ServiceFocusAreas from "../../components/services/ServiceFocusAreas";
import { metadataForSeoPage } from "@/lib/seo";

export async function generateMetadata() {
  return await metadataForSeoPage("services");
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#F9F9F9]">

      {/* Hero Section */}
      <ServiceHero />

      {/* Main Service Content */}
      <div className="relative z-20 w-full flex flex-col max-w-[1920px] mx-auto bg-white">
        <ServiceCounseling />
        <ServiceFocusAreas />
        <Footer />
      </div>

    </main>
    </>
  );
}
