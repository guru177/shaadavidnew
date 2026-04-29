'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Preloader() {
  const pathname = usePathname();
  // Initialize to true ONLY if on the homepage
  const [isVisible, setIsVisible] = useState(pathname === '/');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if we've already played the preloader this session
    const hasSeen = sessionStorage.getItem('preloaderSeen');

    // If we are not on the homepage OR if we've already seen it, ensure it's hidden and exit immediately
    if (pathname !== '/' || hasSeen) {
      setIsVisible(false);
      document.body.style.overflow = '';
      return;
    }

    // Disable body scroll while preloader is active
    document.body.style.overflow = 'hidden';

    // Set shatter trigger to start at 2.5 seconds
    const shatterTimer = setTimeout(() => {
      setIsFadingOut(true);
      document.body.style.overflow = ''; // restore scroll
    }, 2500);

    // Completely remove after 4.0 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('preloaderSeen', 'true');
    }, 4000);

    return () => {
      clearTimeout(shatterTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, [pathname]);

  if (!isVisible) return null;

  // The core UI of the preloader that we will duplicate into shards
  const PreloaderContent = () => (
    <div className="relative w-full h-full bg-[#F9F9F9] flex flex-col items-center justify-center">
      <div className={`relative w-64 md:w-80 h-32 flex items-center justify-center motion-intro`}>
        <img src="/logo.svg" alt="Shaa David" className="w-full h-full object-contain" />
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-60 motion-shine"></div>
        </div>
      </div>
      <div className="mt-8 w-48 h-[2px] bg-gray-200 overflow-hidden">
        <div className="w-full h-full bg-black motion-progress"></div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes cinematicReveal {
          0% {
            clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
            transform: scale(1.15) translateY(20px);
            filter: blur(10px);
            opacity: 0;
          }
          100% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            transform: scale(1) translateY(0);
            filter: blur(0px);
            opacity: 1;
          }
        }
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        @keyframes progressBar {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }

        /* Shatter Keyframes */
        @keyframes shatter1 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          10% { transform: translate(-8px, -12px) rotate(-1deg); opacity: 1; filter: brightness(1.2); }
          100% { transform: translate(-30vw, -40vh) rotate(-25deg); opacity: 0; filter: brightness(1); }
        }
        @keyframes shatter2 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          10% { transform: translate(12px, -8px) rotate(2deg); opacity: 1; filter: brightness(1.2); }
          100% { transform: translate(40vw, -30vh) rotate(35deg); opacity: 0; filter: brightness(1); }
        }
        @keyframes shatter3 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          10% { transform: translate(10px, 12px) rotate(-1deg); opacity: 1; filter: brightness(1.2); }
          100% { transform: translate(30vw, 40vh) rotate(-20deg); opacity: 0; filter: brightness(1); }
        }
        @keyframes shatter4 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          10% { transform: translate(-12px, 8px) rotate(1deg); opacity: 1; filter: brightness(1.2); }
          100% { transform: translate(-40vw, 30vh) rotate(15deg); opacity: 0; filter: brightness(1); }
        }
        @keyframes crackFlash {
          0% { opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 0; }
          100% { opacity: 0; }
        }

        .motion-intro { animation: cinematicReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .motion-shine { animation: shine 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .motion-progress { animation: progressBar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite; }

        .shatter-1 { animation: shatter1 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .shatter-2 { animation: shatter2 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .shatter-3 { animation: shatter3 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .shatter-4 { animation: shatter4 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .animate-flash { animation: crackFlash 1.5s ease-out forwards; }
      `}</style>

      <div className={`fixed inset-0 z-[99999] w-screen h-screen overflow-hidden ${isFadingOut ? 'pointer-events-none' : ''}`}>

        {!isFadingOut ? (
          <div className="absolute inset-0">
            <PreloaderContent />
          </div>
        ) : (
          <>
            {/* Shard 1: Top Left */}
            <div
              className="absolute inset-0 origin-bottom-right shatter-1"
              style={{ clipPath: 'polygon(0 0, 60% 0, 40% 45%, 0 30%)' }}
            >
              <PreloaderContent />
            </div>

            {/* Shard 2: Top Right */}
            <div
              className="absolute inset-0 origin-bottom-left shatter-2"
              style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 70%, 40% 45%)' }}
            >
              <PreloaderContent />
            </div>

            {/* Shard 3: Bottom Right */}
            <div
              className="absolute inset-0 origin-top-left shatter-3"
              style={{ clipPath: 'polygon(100% 70%, 100% 100%, 20% 100%, 40% 45%)' }}
            >
              <PreloaderContent />
            </div>

            {/* Shard 4: Bottom Left */}
            <div
              className="absolute inset-0 origin-top-right shatter-4"
              style={{ clipPath: 'polygon(0 30%, 40% 45%, 20% 100%, 0 100%)' }}
            >
              <PreloaderContent />
            </div>

            {/* Flash & Crack Overlay (Only visible exactly when the screen breaks) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-flash">
              <div className="absolute inset-0 bg-white/50"></div>
              {/* SVG Vector Cracks */}
              <svg className="absolute inset-0 w-full h-full drop-shadow-2xl" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Primary fracture lines matching the polygon shards */}
                <path d="M40 45 L0 30 M40 45 L60 0 M40 45 L100 70 M40 45 L20 100"
                  stroke="#222" strokeWidth="0.5" fill="none" />
                {/* Secondary spider-web cracks */}
                <path d="M40 45 L30 10 M40 45 L80 20 M40 45 L70 100 M40 45 L0 80"
                  stroke="#444" strokeWidth="0.2" fill="none" opacity="0.5" />
                <path d="M15 35 L30 25 M35 15 L50 20 M60 25 L80 40 M70 85 L50 65 M25 70 L10 60"
                  stroke="#666" strokeWidth="0.1" fill="none" opacity="0.4" />
              </svg>
            </div>
          </>
        )}

      </div>
    </>
  );
}
