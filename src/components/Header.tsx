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
  const [mounted, setMounted] = useState(false);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      router.push('/profile');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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
        suppressHydrationWarning
        className={`flex items-center justify-between px-5 md:px-8 xl:px-12 2xl:px-16 fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] z-[500] transition-all duration-300 ${effectiveIsScrolled
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

            <Link href="/services" className="hover:text-black transition-colors">Services</Link>

            <Link href="/product" className="hover:text-black transition-colors">Products</Link>
            <Link href="/blogs" className="hover:text-black transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          </nav>
        </div>

        {/* Right Header Area */}
        <div className="flex items-center justify-end w-auto xl:w-[38%] pr-0 xl:pr-4 gap-4 xl:gap-12 relative z-50">
          {/* User Account Button with Dropdown */}
          <div className="relative group py-4">
            <button
              suppressHydrationWarning
              onClick={handleUserIconClick}
              className={`p-2 md:p-2.5 2xl:p-3.5 rounded-full transition-colors backdrop-blur-sm flex items-center gap-2 ${effectiveIsScrolled
                ? 'bg-[#29425e]/10 hover:bg-[#29425e]/20 text-[#29425e]'
                : 'bg-[#29425e]/10 xl:bg-white/10 hover:bg-[#29425e]/20 xl:hover:bg-white/20 text-[#29425e] xl:text-white'
                }`}
              aria-label="User Account"
            >
              <svg className="group-hover:scale-110 transition-transform origin-center w-[18px] h-[18px] 2xl:w-[24px] 2xl:h-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>
          </div>

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
            className={`xl:hidden relative z-[210] flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 active:scale-95 ${effectiveIsScrolled
              ? 'bg-[#29425e]/5 hover:bg-[#29425e]/10 text-[#29425e]'
              : 'bg-white/10 hover:bg-white/20 text-[#29425e] xl:text-white'
              }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Menu</span>
            <div className="flex flex-col gap-1.5 items-end">
              <span className={`h-0.5 bg-current rounded-full transition-all duration-500 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
              <span className={`h-0.5 bg-current rounded-full transition-all duration-500 ${isMobileMenuOpen ? 'opacity-0' : 'w-4'}`} />
              <span className={`h-0.5 bg-current rounded-full transition-all duration-500 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
            </div>
          </button>

        </div>

      </header>

      {/* Mobile Sidebar Menu - Global stacking context */}
      <div
        className={`fixed inset-0 z-[2000] xl:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}
      >
        {/* Blurred Backdrop - Clickable to close */}
        <div
          className={`absolute inset-0 bg-[#0c1622]/20 backdrop-blur-xl transition-opacity duration-700 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar Container */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] sm:w-[60%] md:w-[50%] bg-[#0c1622] shadow-[-20px_0_80px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Glass Overlay for Sidebar */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />

          {/* Decorative Elements */}
          <div className={`absolute top-[-10%] right-[-10%] w-[100%] h-[100%] bg-[#29425e]/10 rounded-full blur-[120px] transition-all duration-1000 delay-300 ${isMobileMenuOpen ? 'opacity-60 translate-y-0' : 'opacity-0 -translate-y-20'}`} />

          {/* Close Button */}
          <button
            className={`absolute top-6 left-[-70px] z-[2001] w-14 h-14 flex items-center justify-center bg-white text-[#0c1622] rounded-full shadow-2xl transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Content Wrapper */}
          <div className="relative h-full w-full flex flex-col z-[2002] px-6 py-20 overflow-y-auto">
            {/* Sidebar Header */}
            <div className={`flex items-center justify-between mb-12 transition-all duration-700 delay-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Global Platform</span>
              <div className="flex-1 mx-4 h-[1px] bg-white/10" />
            </div>

            {/* Navigation Links - Magazine Style */}
            <nav className="flex flex-col gap-8 md:gap-10">
              {[
                { name: 'Home', href: '/', tagline: 'Start here' },
                { name: 'About us', href: '/about', tagline: 'Our journey' },
                { name: 'Services', href: '/services', tagline: 'Excellence' },
                { name: 'Products', href: '/product', tagline: 'Innovation' },
                { name: 'Blog', href: '/blogs', tagline: 'Insights' },
                { name: 'Contact', href: '/contact', tagline: 'Connect' },
              ].map((link, idx) => (
                <div key={link.name} className="flex flex-col gap-4">
                  <Link
                    href={link.href}
                    className={`group flex items-start gap-4 md:gap-6 transition-all duration-700 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                    style={{ transitionDelay: `${idx * 100 + 400}ms` }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-white/20 font-mono text-xs mt-1 font-bold group-hover:text-white transition-colors">0{idx + 1}</span>
                    <div className="flex flex-col">
                      <span className="text-3xl md:text-5xl font-bold text-white group-hover:italic group-hover:translate-x-2 transition-all duration-300">
                        {link.name}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className={`mt-auto pt-8 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-6 transition-all duration-700 delay-1000 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} border-t border-white/10`}>
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-xl scale-90 xs:scale-75 origin-left">
                <div className="relative w-20 h-5 sm:w-24 sm:h-6">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <a href="tel:+917907075923" className="flex items-center gap-2 text-white text-xs sm:text-sm font-bold group">
                <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0c1622] transition-all">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </span>
                <span className="whitespace-nowrap tracking-tight">+91 790 707 5923</span>
              </a>
            </div>
          </div>
        </div>
      </div>


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
