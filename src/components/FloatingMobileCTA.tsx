'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingMobileCTA() {
  const pathname = usePathname();

  // Don't show on product page or if not on mobile (using CSS for mobile check)
  if (pathname === '/product') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[50] max-[1020px]:flex hidden animate-in fade-in slide-in-from-bottom-full duration-700">
      <Link 
        href="/product"
        className="flex items-center justify-center gap-3 w-full py-6 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-white rounded-t-[32px] font-black text-xl shadow-[0_-20px_50px_rgba(0,0,0,0.2)] border-t border-white/20 active:scale-[0.98] transition-all"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Buy Book
      </Link>
    </div>
  );
}
