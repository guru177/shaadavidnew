"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="flex items-center justify-between py-5 px-5 md:py-8 md:px-8 xl:px-12 relative z-50">
      {/* Left / Center Nav Area */}
      <div className="flex items-center flex-1 relative z-50">
        {/* Logo */}
        <div className="relative w-[130px] md:w-[160px] xl:w-[180px] h-8 xl:h-10 flex items-center">
          <Image 
            src="/logo.svg" 
            alt="TestiQA Logo" 
            fill 
            className="object-contain object-left" 
            priority 
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-10 text-base font-bold ml-12 text-[#29425e]">
          <a href="#" className="hover:text-black transition-colors">About us</a>
          <a href="#" className="hover:text-black transition-colors">Services</a>
          <a href="#" className="hover:text-black transition-colors">Products</a>
          <a href="#" className="hover:text-black transition-colors">Blog</a>
          <a href="#" className="hover:text-black transition-colors">Contact</a>
        </nav>
      </div>

      {/* Right Header Area */}
      <div className="flex items-center justify-end w-auto xl:w-[38%] pr-0 xl:pr-4 gap-4 xl:gap-12 relative z-50">
        {/* Get in touch */}
        <div className="flex items-center gap-2 xl:gap-3 text-[#29425e] xl:text-white">
          <span className="font-medium text-[13px] md:text-sm hidden sm:block">Get in touch</span>
          <a href="tel:+917907075923" className="bg-[#29425e]/10 xl:bg-white/10 p-2 md:p-2.5 rounded-full hover:bg-[#29425e]/20 xl:hover:bg-white/20 transition-colors backdrop-blur-sm group text-[#29425e] xl:text-white">
            <svg className="animate-ring group-hover:scale-110 transition-transform origin-center" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="xl:hidden flex items-center justify-center p-2 -mr-2 rounded-lg text-[#29425e] hover:bg-[#29425e]/5 transition-colors focus:outline-none"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>

      {/* Mobile/Tablet Sidebar Menu */}
      <div className={`fixed inset-0 z-[60] xl:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        
        {/* Blurred Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div 
          className={`absolute top-0 right-0 h-full w-[75%] sm:w-[50%] md:w-[40%] max-w-[320px] bg-[#F9F9F9]/95 backdrop-blur-xl shadow-[[-20px_0_40px_rgba(0,0,0,0.1)]] flex flex-col pt-5 sm:pt-7 px-5 sm:px-8 transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Sidebar Header (Get in touch + Close) */}
          <div className="flex items-center justify-between w-full mb-10 sm:mb-12">
            <div className="flex items-center gap-2 text-[#29425e]">
              <span className="font-medium text-[13px] md:text-sm">Get in touch</span>
              <a href="tel:+917907075923" className="bg-[#29425e]/10 p-2 md:p-2.5 rounded-full hover:bg-[#29425e]/20 transition-colors backdrop-blur-sm group text-[#29425e]">
                <svg className="animate-ring group-hover:scale-110 transition-transform origin-center" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </a>
            </div>

            <button 
              className="flex items-center justify-center p-2 -mr-2 rounded-lg text-[#29425e] hover:bg-[#29425e]/5 transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <nav className="flex flex-col gap-8 text-xl font-bold text-[#29425e]">
            <a href="#" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About us</a>
            <a href="#" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
            <a href="#" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Products</a>
            <a href="#" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
            <a href="#" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
