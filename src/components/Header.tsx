"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { formatPhoneDisplay, toTelHref } from '@/lib/contactFormat';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();
  const { cartCount, setIsCartOpen } = useCart();
  const phoneHref = toTelHref(settings.contact.phone);
  const phoneLabel = formatPhoneDisplay(settings.contact.phone);

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
        className="flex items-center justify-between px-5 md:px-8 xl:px-12 2xl:px-16 fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] z-[500] transition-all duration-300 py-2 md:py-2.5 2xl:py-3 bg-white/80 backdrop-blur-lg shadow-sm"
      >
        {/* Left / Center Nav Area */}
        <div className="flex items-center flex-1 relative z-50">
          {/* Logo */}
          <Link href="/" className="relative w-10 h-10 md:w-11 md:h-11 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center cursor-pointer shrink-0 rounded-full overflow-hidden bg-black">
            <Image
              src="/logo.png"
              alt={settings.siteName}
              fill
              className="object-cover"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-10 text-sm 2xl:text-lg font-bold ml-8 2xl:ml-12 text-[#29425e]">
            <Link href="/" className="hover:text-black transition-colors whitespace-nowrap">Home</Link>
            <Link href="/about" className="hover:text-black transition-colors whitespace-nowrap">About us</Link>
            <Link href="/services" className="hover:text-black transition-colors whitespace-nowrap">Services</Link>
            <Link href="/shop" className="hover:text-black transition-colors whitespace-nowrap">Products</Link>
            <Link href="/track" className="hover:text-black transition-colors whitespace-nowrap">Track order</Link>
            <Link href="/blogs" className="hover:text-black transition-colors whitespace-nowrap">Blog</Link>
            <Link href="/gallery" className="hover:text-black transition-colors whitespace-nowrap">Gallery</Link>
            <Link href="/contact" className="hover:text-black transition-colors whitespace-nowrap">Contact</Link>
          </nav>
        </div>

        {/* Right Header Area */}
        <div className="flex items-center justify-end w-auto xl:w-[38%] pr-0 xl:pr-4 gap-3 md:gap-4 xl:gap-8 relative z-50">
          {/* Cart */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 md:p-2 2xl:p-2.5 rounded-full bg-[#29425e]/10 hover:bg-[#29425e]/20 text-[#29425e] transition-colors"
            aria-label={cartCount ? `Open cart, ${cartCount} items` : "Open cart"}
          >
            <svg
              className="w-[16px] h-[16px] 2xl:w-[20px] 2xl:h-[20px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0c1622] px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Get in touch */}
          <div className="flex items-center gap-2 xl:gap-3 transition-colors duration-300 text-[#29425e]">
            <span className="font-medium text-[13px] md:text-sm 2xl:text-lg hidden sm:block">Get in touch</span>
            <a href={phoneHref} className="p-1.5 md:p-2 2xl:p-2.5 rounded-full transition-colors backdrop-blur-sm group bg-[#29425e]/10 hover:bg-[#29425e]/20 text-[#29425e]" aria-label={phoneLabel}>
              <svg className="animate-ring group-hover:scale-110 transition-transform origin-center w-[16px] h-[16px] 2xl:w-[20px] 2xl:h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden relative z-[210] flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 active:scale-95 bg-[#29425e]/5 hover:bg-[#29425e]/10 text-[#29425e]"
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

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-[2000] xl:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}
      >
        <div
          className={`absolute inset-0 bg-[#0c1622]/20 backdrop-blur-xl transition-opacity duration-700 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[85%] sm:w-[60%] md:w-[50%] bg-[#0c1622] shadow-[-20px_0_80px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
          <div className={`absolute top-[-10%] right-[-10%] w-[100%] h-[100%] bg-[#29425e]/10 rounded-full blur-[120px] transition-all duration-1000 delay-300 ${isMobileMenuOpen ? 'opacity-60 translate-y-0' : 'opacity-0 -translate-y-20'}`} />

          <button
            className={`absolute top-5 right-5 z-[2001] w-11 h-11 flex items-center justify-center bg-white text-[#0c1622] rounded-full shadow-2xl transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div className="relative h-full w-full flex flex-col z-[2002] px-5 sm:px-6 pt-20 pb-8 overflow-y-auto overscroll-contain">
            <div className={`flex items-center justify-between mb-8 sm:mb-10 transition-all duration-700 delay-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.35em]">Menu</span>
              <div className="flex-1 mx-4 h-[1px] bg-white/10" />
            </div>

            <nav className="flex flex-col gap-5 sm:gap-6 md:gap-8">
              {[
                { name: 'Home', href: '/', tagline: 'Start here' },
                { name: 'About us', href: '/about', tagline: 'Our journey' },
                { name: 'Services', href: '/services', tagline: 'Excellence' },
                { name: 'Products', href: '/shop', tagline: 'Innovation' },
                { name: 'Track order', href: '/track', tagline: 'Status' },
                { name: 'Blog', href: '/blogs', tagline: 'Insights' },
                { name: 'Gallery', href: '/gallery', tagline: 'Moments' },
                { name: 'Contact', href: '/contact', tagline: 'Connect' },
              ].map((link, idx) => (
                <div key={link.name} className="flex flex-col gap-4">
                  <Link
                    href={link.href}
                    className={`group flex items-start gap-3 sm:gap-4 md:gap-6 transition-all duration-700 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                    style={{ transitionDelay: `${idx * 80 + 300}ms` }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-white/20 font-mono text-[10px] sm:text-xs mt-1.5 font-bold group-hover:text-white transition-colors">0{idx + 1}</span>
                    <div className="flex flex-col">
                      <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-white group-hover:italic group-hover:translate-x-2 transition-all duration-300">
                        {link.name}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </nav>

            <div className={`mt-auto pt-8 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-6 transition-all duration-700 delay-1000 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} border-t border-white/10`}>
              <div className="bg-black rounded-full shadow-xl scale-90 xs:scale-75 origin-left overflow-hidden">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                  <Image
                    src="/logo.png"
                    alt={settings.siteName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <a href={phoneHref} className="flex items-center gap-2 text-white text-xs sm:text-sm font-bold group">
                <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0c1622] transition-all">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </span>
                <span className="whitespace-nowrap tracking-tight">{phoneLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
