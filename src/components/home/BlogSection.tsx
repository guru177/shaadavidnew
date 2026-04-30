"use client";

import React from 'react';

export default function BlogSection() {
  return (
    <section className="relative w-full bg-[#FAFAFA] py-[80px] md:py-[100px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto overflow-hidden">

      {/* Top Double Gradient Border */}
      <div className="absolute top-0 left-0 w-full flex flex-col gap-[2px] md:gap-1 z-10">
        <div className="w-full h-[3px] md:h-[4px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer" />
        <div className="w-full h-[1px] md:h-[2px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer opacity-60" />
      </div>

      {/* Bottom Double Gradient Border */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col gap-[2px] md:gap-1 z-10">
        <div className="w-full h-[1px] md:h-[2px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer opacity-60" />
        <div className="w-full h-[3px] md:h-[4px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer" />
      </div>

      <div className="flex flex-col md:flex-row mb-10 xl:mb-16 items-start md:items-end justify-between w-full gap-6">
        <div className="flex flex-col items-start">
          <span className="inline-flex rounded-full px-5 py-2 2xl:px-8 2xl:py-3 text-sm md:text-base 2xl:text-xl font-bold text-white bg-[#29425e] mb-4 md:mb-6 shadow-md cursor-default">
            Latest Articles
          </span>
          <h2 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-6xl font-malayalam font-extrabold text-[#29425e] leading-[1.3] tracking-tight">
            ഞങ്ങളുടെ ബ്ലോഗുകൾ
          </h2>
        </div>

        <button className="flex items-center justify-center gap-3 px-6 py-3 2xl:px-8 2xl:py-4 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] bg-[position:0%_center] hover:animate-shimmer transition-all transform hover:scale-105 hover:brightness-110 text-white shadow-[0_10px_30px_rgba(41,66,94,0.3)] rounded-full group font-malayalam font-bold text-sm md:text-base 2xl:text-lg">
          കൂടുതൽ വായിക്കുക (View More)
          <svg className="w-4 h-4 2xl:w-5 2xl:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16">

        {/* Left: Main Featured Post (col-span-6) */}
        <div className="col-span-1 lg:col-span-6 flex flex-col group cursor-pointer bg-white rounded-[28px] 2xl:rounded-[30px] shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
          <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
            <img loading="lazy"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="Featured Blog"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-5 sm:p-8 2xl:p-10 flex flex-col flex-1">
            <h3 className="text-xl sm:text-3xl md:text-4xl 2xl:text-4xl font-malayalam font-extrabold text-[#29425e] mb-4 sm:mb-6 group-hover:opacity-80 transition-colors leading-[1.4]">
              ഇംഗ്ലീഷ് സംസാരിക്കാൻ പേടിയാണോ? ഈ 5 കാര്യങ്ങൾ ശ്രദ്ധിച്ചാൽ മതി
            </h3>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-base 2xl:text-lg text-gray-500 font-medium flex-wrap mt-auto">
              <div className="flex items-center gap-2">
                <img loading="lazy" src="https://ui-avatars.com/api/?name=Shaa+David&background=29425e&color=fff" alt="Author" className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-full object-cover" />
                <span className="text-[#111] font-bold">Shaa David</span>
              </div>
              <span className="hidden xs:block text-gray-300">|</span>
              <span className="px-2.5 py-1 bg-[#29425e]/10 text-[#29425e] rounded-md font-semibold text-[10px] sm:text-sm">Tips & Tricks</span>
              <span className="hidden sm:block text-gray-300">|</span>
              <span className="text-[10px] sm:text-sm">Oct 11, 2024 • 8 min</span>
            </div>
          </div>
        </div>

        {/* Right: Trending Block & Small Posts (col-span-5) */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-6 sm:gap-8 2xl:gap-10">

          {/* Trending Block */}
          <div className="w-full rounded-[24px] 2xl:rounded-[30px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer p-6 sm:p-10 2xl:p-12 relative overflow-hidden shadow-lg flex items-center justify-between min-h-[140px] sm:min-h-[160px] 2xl:min-h-[200px] group cursor-pointer">
            {/* Title */}
            <h3 className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-bold text-white relative z-10 leading-[1.3] w-[65%] group-hover:scale-105 transition-transform duration-500 origin-left">
              Trending <br /> on Shaa David's
            </h3>

            {/* Decorative Graphics (Right side) - Matching Riverside abstract shapes */}
            <div className="absolute right-0 top-0 w-[50%] h-full flex flex-col items-end justify-center pointer-events-none opacity-90">
              <div className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-28 2xl:h-28 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl rotate-12 -translate-y-4 sm:-translate-y-6 translate-x-3 sm:translate-x-4 flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-700 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                <div className="flex gap-1 sm:gap-1.5">
                  <div className="w-1 h-4 sm:w-1.5 sm:h-6 bg-white/70 rounded-full animate-pulse"></div>
                  <div className="w-1 h-8 sm:w-1.5 sm:h-10 bg-white/70 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-white/70 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Small Posts List */}
          <div className="flex flex-col gap-4 sm:gap-6 2xl:gap-8">
            {[
              {
                title: "ദിവസേന ഉപയോഗിക്കാൻ കഴിയുന്ന 50 ഇംഗ്ലീഷ് വാക്കുകൾ",
                date: "Jun 26, 2024 • 14 min",
                tag: "Vocabulary",
                img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80"
              },
              {
                title: "Grammar ഇല്ലാതെ ഇംഗ്ലീഷ് സംസാരിക്കാൻ സാധിക്കുമോ?",
                date: "Mar 21, 2024 • 14 min",
                tag: "Speaking",
                img: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=400&q=80"
              },
              {
                title: "ഇംഗ്ലീഷ് സിനിമകൾ കണ്ടുകൊണ്ട് ഭാഷ എങ്ങനെ മെച്ചപ്പെടുത്താം?",
                date: "Mar 5, 2024 • 10 min",
                tag: "Learning",
                img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80"
              }
            ].map((post, idx) => (
              <div key={idx} className="flex gap-3 sm:gap-6 group cursor-pointer bg-white rounded-[20px] 2xl:rounded-[24px] p-3 sm:p-4 2xl:p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 items-center">
                {/* Thumbnail */}
                <div className="w-[80px] h-[65px] sm:w-[130px] sm:h-[90px] 2xl:w-[160px] 2xl:h-[110px] shrink-0 rounded-[10px] sm:rounded-[12px] 2xl:rounded-[16px] overflow-hidden relative shadow-sm">
                  <img loading="lazy" src={post.img} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                {/* Details */}
                <div className="flex flex-col justify-center flex-1 h-full py-0.5 sm:py-1">
                  <h4 className="text-sm sm:text-lg 2xl:text-xl font-malayalam font-bold text-[#29425e] leading-[1.4] mb-2 sm:mb-3 group-hover:opacity-80 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-xs 2xl:text-sm text-gray-500 font-medium flex-wrap mt-auto">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 rounded-full bg-[#29425e] text-white flex items-center justify-center text-[7px] sm:text-[9px] 2xl:text-[10px] font-bold">SD</div>
                      <span className="text-[#111] font-bold text-[9px] sm:text-xs">Shaa David</span>
                    </div>
                    <span className="hidden xs:block text-gray-300">|</span>
                    <span className="px-1.5 py-0.5 bg-[#29425e]/10 text-[#29425e] rounded font-semibold whitespace-nowrap text-[8px] sm:text-[10px]">{post.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
