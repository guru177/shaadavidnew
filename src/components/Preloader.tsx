'use client';

import { useState, useEffect, useRef } from 'react';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // TEMPORARILY DISABLED FOR DEVELOPMENT
    // Uncomment this when you deploy so it doesn't annoy returning users!
    /*
    const hasSeenPreloader = sessionStorage.getItem('preloaderSeen');
    if (hasSeenPreloader) {
      setIsVisible(false);
      return;
    }
    */

    // Ensure video plays (some browsers block autoplay unless explicitly commanded)
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }

    // Disable body scroll while preloader is active
    document.body.style.overflow = 'hidden';

    // Set fade out to start at 7.5 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
      document.body.style.overflow = ''; // restore scroll
    }, 5000);

    // Completely remove after 8.5 seconds (gives 1s for fade out)
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('preloaderSeen', 'true');
    }, 6500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] w-screen h-screen bg-[#050505] transition-opacity duration-[1500ms] ease-in-out will-change-opacity ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Video element with added source tag and ref for manual play */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      >
        <source src="/plane.webm" type="video/webm" />
        <source src="/plane.mp4" type="video/mp4" />
      </video>

      <button
        onClick={() => {
          setIsFadingOut(true);
          document.body.style.overflow = '';
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('preloaderSeen', 'true');
          }, 1000);
        }}
        className="absolute bottom-10 right-10 text-white/50 hover:text-white/90 text-sm tracking-widest font-sans uppercase transition-colors z-10 cursor-pointer"
      >
        Skip
      </button>
    </div>
  );
}
