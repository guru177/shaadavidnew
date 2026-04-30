import React from 'react';

export default function ServiceCounseling() {
  return (
    <section className="relative w-full py-[100px] xl:py-[140px] px-5 md:px-8 xl:px-12 2xl:px-16 overflow-hidden">

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center">

        {/* Left: Artistic Image Stack */}
        <div className="lg:col-span-6 relative h-[500px] md:h-[700px] lg:h-[800px] group">
          {/* Background Shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer opacity-5 rounded-[100px] rotate-6 pointer-events-none"></div>

          {/* Primary Image */}
          <div className="absolute top-10 left-10 w-[80%] h-[80%] rounded-[60px] overflow-hidden shadow-2xl z-20 border-[10px] border-white transform group-hover:scale-105 transition-transform duration-1000">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" alt="Counseling Session" className="w-full h-full object-cover" />
          </div>

          {/* Secondary Floating Accent */}
          <div className="absolute bottom-4 right-2 sm:bottom-20 sm:right-0 w-[40%] sm:w-[45%] aspect-square rounded-[20px] sm:rounded-[40px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-2xl z-30 p-3 sm:p-8 flex flex-col justify-center border border-white/20 transform translate-x-0 sm:translate-x-10 sm:group-hover:translate-x-0 transition-transform duration-700">
            <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-white/20 flex items-center justify-center mb-1.5 sm:mb-4 text-white shadow-inner flex-shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="text-white font-malayalam font-black text-[10px] sm:text-lg mb-0.5 sm:mb-2 leading-tight">100% സ്വകാര്യത</h4>
            <p className="text-blue-100/60 text-[7px] sm:text-xs font-malayalam leading-tight hidden xs:block">വിവരങ്ങൾ സുരക്ഷിതം.</p>
          </div>
        </div>

        {/* Right: Premium Editorial Content */}
        <div className="lg:col-span-6 lg:-ml-20 relative z-40 mt-12 lg:mt-0">
          <div className="bg-white rounded-[40px] sm:rounded-[60px] p-6 sm:p-12 md:p-16 xl:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-gray-50">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] md:text-xs font-black text-white mb-6 sm:mb-8 shadow-md bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer font-malayalam uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              നമുക്ക് ഒന്നിച്ച് മുന്നേറാം
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-malayalam font-extrabold text-[#0c1622] mb-8 sm:mb-10 leading-[1.5]">
              കുട്ടികളുടെ ഭാവി, <span className="sm:block">നമ്മുടെ ഉത്തരവാദിത്തം.</span>
            </h2>

            <div className="space-y-8 sm:space-y-10">
              <div className="flex gap-4 sm:gap-6">
                <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#395c80]/20 flex items-center justify-center font-bold text-[#395c80] text-sm sm:text-base">01</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-malayalam font-bold text-[#0c1622] mb-2 sm:mb-3 leading-snug">പ്രശ്നങ്ങളുടെ ആഴം തിരിച്ചറിയുന്നു</h3>
                  <p className="text-gray-600 font-malayalam text-base sm:text-lg leading-relaxed">പഠനത്തിലോ പെരുമാറ്റത്തിലോ കുട്ടികൾ കാണിക്കുന്ന മാറ്റങ്ങൾ തിരിച്ചറിഞ്ഞ് അവയുടെ മൂലകാരണം കണ്ടെത്താൻ ഞങ്ങൾ സഹായിക്കുന്നു.</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6">
                <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#395c80]/20 flex items-center justify-center font-bold text-[#395c80] text-sm sm:text-base">02</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-malayalam font-bold text-[#0c1622] mb-2 sm:mb-3 leading-snug">മാതാപിതാക്കൾക്ക് പിന്തുണ</h3>
                  <p className="text-gray-600 font-malayalam text-base sm:text-lg leading-relaxed">കുട്ടികളെ സ്നേഹത്തോടെയും ക്ഷമയോടെയും എങ്ങനെ വളർത്താം എന്നതിനെക്കുറിച്ച് രക്ഷിതാക്കൾക്ക് ആവശ്യമായ കൗൺസിലിംഗ് നൽകുന്നു.</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6">
                <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#395c80]/20 flex items-center justify-center font-bold text-[#395c80] text-sm sm:text-base">03</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-malayalam font-bold text-[#0c1622] mb-2 sm:mb-3 leading-snug">ലക്ഷ്യബോധമുള്ള തലമുറ</h3>
                  <p className="text-gray-600 font-malayalam text-base sm:text-lg leading-relaxed">ആത്മവിശ്വാസത്തോടെയും വ്യക്തമായ ലക്ഷ്യങ്ങളോടെയും മുന്നേറാൻ വിദ്യാർത്ഥികളെ പ്രാപ്തരാക്കുന്നു.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <h4 className="text-[#0c1622] font-malayalam font-bold text-lg mb-2 leading-snug">സുരക്ഷിതമായ ഇടം</h4>
        <p className="text-gray-500 font-malayalam text-base leading-relaxed">നിങ്ങളുടെ പ്രശ്നങ്ങൾ തുറന്നു പറയാനും പരിഹാരം കണ്ടെത്താനുമുള്ള മാന്യമായ പ്ലാറ്റ്‌ഫോം.</p>
      </div>
    </section >
  );
}
