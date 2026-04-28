"use client";

import React from 'react';

export default function WhyChooseUs() {
  return (
    <section className="relative w-full bg-white py-[80px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto">

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 2xl:gap-16 items-center">

        {/* Top Left: Text block */}
        <div className="flex flex-col justify-center order-1">
          {/* Top Heading */}
          <div className="flex flex-col items-start xl:mb-10">
            <span className="inline-flex rounded-full px-5 py-2 2xl:px-8 2xl:py-3 text-sm md:text-base 2xl:text-xl font-bold text-white mb-4 md:mb-6 shadow-md hover:shadow-lg transition-all cursor-default bg-[#29425e]">
              Why Choose Us
            </span>
            <h2 className="text-4xl sm:text-4xl xl:text-4xl 2xl:text-6xl font-malayalam font-extrabold text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer leading-[1.3] md:leading-[1.5] tracking-tight drop-shadow-sm -mb-2 md:-mb-6 pt-4 -mt-4">
              ഒരു പുസ്തകം & അനവധി പ്രയോജനങ്ങൾ
            </h2>
          </div>
          <p className="text-gray-500 text-lg md:text-xl xl:text-2xl font-malayalam font-medium leading-[1.8] xl:leading-[1.9] mt-4">
            ഇംഗ്ലീഷ് കേട്ടാൽ മനസ്സിലാകും, പക്ഷേ സംസാരിക്കാൻ ബുദ്ധിമുട്ടാണോ? <span className="text-[#29425e] font-bold">Sha David's English Companion</span> നിങ്ങളുടെ ആത്മവിശ്വാസം കൂട്ടിയും, grammar ഭയം ഇല്ലാതെ sentence formation പഠിപ്പിക്കുന്ന perfect guide ആണിത്.
          </p>
        </div>

        {/* Top Right: Wide Image */}
        <div className="w-full h-[250px] md:h-[300px] 2xl:h-[400px] rounded-[30px] overflow-hidden order-2">
          <img loading="lazy"
            src="/why1.jpg"
            alt="Students collaborating"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Bottom Left: Two Images */}
        <div className="flex gap-4 h-[300px] md:h-[400px] xl:h-[450px] 2xl:h-[550px] order-4 lg:order-3">
          <div className="w-[55%] h-full rounded-[30px] overflow-hidden">
            <img loading="lazy"
              src="/why2.jpg"
              alt="Expert Trainer"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="w-[45%] h-full rounded-[80px] md:rounded-[120px] 2xl:rounded-[150px] rounded-bl-[20px] md:rounded-bl-[24px] 2xl:rounded-bl-[30px] overflow-hidden">
            <img loading="lazy"
              src="/why3.jpg"
              alt="Interactive Learning"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Bottom Right: Text Block */}
        <div className="flex flex-col justify-center order-3 lg:order-4 mb-8 lg:mb-0">
          <p className="text-gray-500 text-lg md:text-xl xl:text-2xl font-malayalam leading-[1.8] xl:leading-[1.9] mb-4 md:mb-6">
            <span className="text-[#29425e] font-bold">Easy tips, known words, and real speaking practice</span> – ഇതൊക്കെയാണ് ഈ പുസ്തകത്തിന്റെ highlight.
          </p>
          <div className="flex flex-col gap-4 mb-4">
            <p className="text-gray-500 text-lg md:text-xl xl:text-2xl font-malayalam leading-[1.8] xl:leading-[1.9] mb-4">
              സങ്കീർണ്ണമായ വ്യാകരണ നിയമങ്ങളില്ലാതെ, നിങ്ങൾക്കറിയാവുന്ന സാധാരണ വാക്കുകൾ കൊണ്ടുതന്നെ വളരെ വേഗത്തിൽ തെറ്റുകൂടാതെ ഇംഗ്ലീഷ് സംസാരിക്കാൻ ഈ പുസ്തകം നിങ്ങളെ പ്രാപ്തരാക്കും.
              കേവലം വായിച്ചു പോകാനല്ല, മറിച്ച് നിത്യജീവിതത്തിൽ ഉപയോഗിക്കാൻ കഴിയുന്ന തരത്തിലുള്ള പ്രായോഗിക പരിശീലനമാണ് ഈ പുസ്തകം മുന്നോട്ട് വയ്ക്കുന്നത്.
            </p>
          </div>

          <button className="flex items-center justify-center gap-3 px-8 py-3.5 md:py-4 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] bg-[position:0%_center] hover:animate-shimmer transition-all transform hover:scale-105 hover:brightness-110 text-white shadow-[0_10px_30px_rgba(41,66,94,0.3)] rounded-full w-fit group">
            <span className="font-malayalam font-bold text-sm md:text-base">കൂടുതൽ വിവരങ്ങൾ (Know More)</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
