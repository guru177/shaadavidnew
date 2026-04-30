"use client";

import React, { useState } from "react";
import Globe3D from "@/components/Globe3D";

export default function ProductGallery() {
  const [activeTab, setActiveTab] = useState<number | "3d">(1);

  return (
    <div className="lg:sticky top-28 flex flex-col gap-4">
      {/* Main Image or 3D Render */}
      <div className="w-full h-[350px] md:h-[450px] border border-gray-100 rounded-3xl p-4 flex items-center justify-center relative cursor-crosshair group overflow-hidden">
        {activeTab === "3d" ? (
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Globe3D />
          </div>
        ) : (
          <img 
            src="/product.png" 
            className="max-w-full max-h-full object-contain group-hover:scale-125 transition-transform duration-500" 
            alt="Shaa David English Companion" 
          />
        )}
        
        {/* Share Icon */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center cursor-pointer text-gray-400 hover:text-[#395c80] transition-colors z-10">
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </div>
      </div>

      {/* Thumbnails (Horizontal) */}
      <div className="flex gap-2 md:gap-4 w-full pb-2" style={{ scrollbarWidth: 'none' }}>
        {[1,2,3,4].map((i) => (
          <div 
            key={i} 
            onClick={() => setActiveTab(i)}
            className={`flex-1 aspect-square border ${activeTab === i ? 'border-[#395c80] border-2' : 'border-gray-200'} rounded-xl p-2 md:p-3 cursor-pointer hover:border-[#395c80] hover:border-2 transition-all relative`}
          >
            <img src="/product.png" className="w-full h-full object-contain" alt={`Thumbnail ${i}`} />
          </div>
        ))}

        {/* 360 Degree / 3D Render Button */}
        <div 
          onClick={() => setActiveTab("3d")}
          className={`flex-1 aspect-square border ${activeTab === "3d" ? 'border-[#395c80] border-2' : 'border-gray-200'} rounded-xl p-2 md:p-3 cursor-pointer hover:border-[#395c80] hover:border-2 transition-all relative flex items-center justify-center overflow-hidden bg-gray-50`}
        >
          <img src="/product.png" className="w-full h-full object-contain opacity-40 grayscale" alt="360 Render" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
            <svg className="w-8 h-8 text-[#395c80] drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span className="text-[10px] md:text-xs font-bold text-[#395c80] mt-1 bg-white/80 px-2 py-0.5 rounded-full shadow-sm">360°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
