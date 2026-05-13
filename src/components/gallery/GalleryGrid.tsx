"use client";

import React, { useState, useEffect } from 'react';

const dummyImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
];

export default function GalleryGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev! < dummyImages.length - 1 ? prev! + 1 : 0));
      if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : dummyImages.length - 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <>
      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {dummyImages.map((src, index) => (
          <div 
            key={index} 
            className="break-inside-avoid relative rounded-[20px] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            <img 
              src={src} 
              alt={`Gallery image ${index + 1}`} 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle hover dark overlay instead of text */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
            
            {/* View Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all duration-300 z-50 transform hover:scale-110 hover:rotate-90"
            onClick={() => setSelectedIndex(null)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Number Counter */}
          <div className="absolute top-8 left-8 text-white/50 font-mono text-sm sm:text-base tracking-[0.2em] z-50">
            <span className="text-white font-bold">{selectedIndex + 1}</span> / {dummyImages.length}
          </div>

          {/* Image Container */}
          <div 
            className="relative w-full max-w-6xl max-h-[85vh] flex items-center justify-center group"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={dummyImages[selectedIndex]} 
              alt={`Full size ${selectedIndex + 1}`} 
              className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-opacity duration-300"
            />
            
            {/* Prev Button */}
            <button 
              className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-white/50 hover:text-white bg-black/20 hover:bg-white/10 backdrop-blur-md rounded-full transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 sm:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(prev => prev! > 0 ? prev! - 1 : dummyImages.length - 1);
              }}
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Next Button */}
            <button 
              className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-white/50 hover:text-white bg-black/20 hover:bg-white/10 backdrop-blur-md rounded-full transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 sm:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(prev => prev! < dummyImages.length - 1 ? prev! + 1 : 0);
              }}
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
