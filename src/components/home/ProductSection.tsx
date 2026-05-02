"use client";

import React from 'react';

export default function ProductSection() {
  return (
    <section className="relative w-full bg-white pt-[120px] md:pt-[160px] pb-[80px] md:pb-[100px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto overflow-hidden">

      <div className="relative w-full rounded-[32px] sm:rounded-[40px] 2xl:rounded-[50px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] p-7 sm:p-12 lg:p-16 2xl:p-24 overflow-hidden flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20 shadow-2xl">

        {/* Background is purely the shimmering gradient now */}

        {/* Left: Product Image */}
        <div className="w-full lg:w-[40%] relative flex flex-col justify-center items-center z-10">
          <div className="relative transform hover:scale-105 transition-transform duration-500 m-auto overflow-hidden rounded-[30px] shadow-2xl">
            {/* Soft glow behind book */}
            <div className="absolute inset-0 bg-white/20 blur-[50px] rounded-full"></div>
            <img loading="lazy"
              src="/product.webp"
              alt="Shaa David's English Companion"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/product1.webp";
                e.currentTarget.className = "w-full h-full object-cover";
              }}
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center items-start z-10">
          <span className="inline-flex rounded-full px-5 py-2 2xl:px-8 2xl:py-3 text-sm md:text-base 2xl:text-xl font-bold text-[#29425e] bg-white mb-6 shadow-xl cursor-default">
            ഔദ്യോഗിക പുസ്തകം
          </span>

          <h2 className="text-3xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-malayalam font-extrabold text-white leading-[1.3] mb-6 tracking-tight drop-shadow-md">
            ഷാ ഡേവിഡിന്റെ <br /> ഇംഗ്ലീഷ് കമ്പാനിയൻ
          </h2>

          <p className="text-white/90 text-lg md:text-xl 2xl:text-2xl font-malayalam leading-[1.8] 2xl:leading-[2] w-full font-medium mb-8">
            മലയാളത്തിലൂടെ വളരെ എളുപ്പത്തിൽ ഇംഗ്ലീഷ് പഠിക്കാൻ സഹായിക്കുന്ന സമ്പൂർണ്ണ ഗൈഡ്. വ്യാകരണ നിയമങ്ങളുടെ ഭയമില്ലാതെ ആത്മവിശ്വാസത്തോടെ സംസാരിക്കാൻ ഇന്ന് തന്നെ സ്വന്തമാക്കൂ.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 w-full">
            <div className="flex flex-col w-full sm:w-auto bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="text-white/60 line-through text-sm md:text-base font-bold">₹1,999</span>
              <span className="text-3xl md:text-4xl 2xl:text-5xl font-extrabold text-white">₹999</span>
            </div>

            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 2xl:px-12 py-4 2xl:py-5 bg-white text-[#29425e] hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl rounded-full group">
              <span className="font-malayalam font-bold text-base 2xl:text-xl tracking-wide">ഇപ്പോൾ വാങ്ങുക</span>
              <svg className="w-5 h-5 2xl:w-6 2xl:h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[
              "100+ പ്രായോഗിക പാഠങ്ങൾ",
              "യഥാർത്ഥ ജീവിത സംഭാഷണങ്ങൾ",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-black/10 px-4 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold text-white/90 text-sm md:text-base 2xl:text-lg">{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
