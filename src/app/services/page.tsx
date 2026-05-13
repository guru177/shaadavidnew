import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServiceHero from "../../components/services/ServiceHero";
import ServiceCounseling from "../../components/services/ServiceCounseling";
import ServiceFocusAreas from "../../components/services/ServiceFocusAreas";

export const metadata = {
  title: 'Our Services | Shaa David',
  description: 'Expert counseling and educational support for parents and students to overcome academic and behavioral challenges.',
};

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
