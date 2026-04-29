"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const [isScrolled, setIsScrolled] = useState(false);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      router.push('/profile');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // If not on the home page, the header is always in the "sticky/scrolled" state
  const effectiveIsScrolled = isScrolled || pathname !== '/';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>

      <header
        className={`flex items-center justify-between px-5 md:px-8 xl:px-12 2xl:px-16 fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] z-[100] transition-all duration-300 ${effectiveIsScrolled
          ? 'py-4 md:py-5 2xl:py-6 bg-white/80 backdrop-blur-lg shadow-sm'
          : 'py-5 md:py-8 2xl:py-10 bg-transparent'
          }`}
      >
        {/* Left / Center Nav Area */}
        <div className="flex items-center flex-1 relative z-50">
          {/* Logo */}
          <Link href="/" className="relative w-[130px] md:w-[160px] xl:w-[180px] 2xl:w-[220px] h-8 xl:h-10 2xl:h-12 flex items-center cursor-pointer">
            <Image
              src="/logo.svg"
              alt="TestiQA Logo"
              fill
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-10 2xl:gap-14 text-base 2xl:text-xl font-bold ml-12 2xl:ml-20 text-[#29425e]">
            <Link href="/about" className="hover:text-black transition-colors">About us</Link>
            <Link href="/service" className="hover:text-black transition-colors">Services</Link>
            <Link href="/product" className="hover:text-black transition-colors">Products</Link>
            <Link href="/blogs" className="hover:text-black transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          </nav>
        </div>

        {/* Right Header Area */}
        <div className="flex items-center justify-end w-auto xl:w-[38%] pr-0 xl:pr-4 gap-4 xl:gap-12 relative z-50">
          {/* User Account Button */}
          <button
            onClick={handleUserIconClick}
            className={`p-2 md:p-2.5 2xl:p-3.5 rounded-full transition-colors backdrop-blur-sm group ${effectiveIsScrolled
              ? 'bg-[#29425e]/10 hover:bg-[#29425e]/20 text-[#29425e]'
              : 'bg-[#29425e]/10 xl:bg-white/10 hover:bg-[#29425e]/20 xl:hover:bg-white/20 text-[#29425e] xl:text-white'
              }`}
            aria-label="User Account"
          >
            <svg className="group-hover:scale-110 transition-transform origin-center w-[18px] h-[18px] 2xl:w-[24px] 2xl:h-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </button>

          {/* Get in touch */}
          <div className={`flex items-center gap-2 xl:gap-3 transition-colors duration-300 ${effectiveIsScrolled ? 'text-[#29425e]' : 'text-[#29425e] xl:text-white'}`}>
            <span className="font-medium text-[13px] md:text-sm 2xl:text-lg hidden sm:block">Get in touch</span>
            <a href="tel:+917907075923" className={`p-2 md:p-2.5 2xl:p-3.5 rounded-full transition-colors backdrop-blur-sm group ${effectiveIsScrolled
              ? 'bg-[#29425e]/10 hover:bg-[#29425e]/20 text-[#29425e]'
              : 'bg-[#29425e]/10 xl:bg-white/10 hover:bg-[#29425e]/20 xl:hover:bg-white/20 text-[#29425e] xl:text-white'
              }`}>
              <svg className="animate-ring group-hover:scale-110 transition-transform origin-center w-[18px] h-[18px] 2xl:w-[24px] 2xl:h-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden flex items-center justify-center p-2 -mr-2 rounded-lg text-[#29425e] hover:bg-[#29425e]/5 transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <nav className="flex flex-col gap-8 text-xl font-bold text-[#29425e]">
              <Link href="/about" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About us</Link>
              <Link href="/service" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link href="/product" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link href="/blogs" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
              <Link href="/contact" className="hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsLoggedIn(true);
          router.push('/profile');
        }}
      />
    </>
  );
}
