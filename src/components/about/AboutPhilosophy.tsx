export default function AboutPhilosophy() {
  return (
    <section className="relative w-full py-[100px] xl:py-[140px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto bg-white z-20 overflow-hidden">

      {/* Top Double Gradient Border */}
      <div className="absolute top-0 left-0 w-full flex flex-col gap-[2px] md:gap-1 z-10">
        <div className="w-full h-[3px] md:h-[4px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer" />
        <div className="w-full h-[1px] md:h-[2px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer opacity-60" />
      </div>
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#395c80]/5 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">

        {/* Left Side: Elegant Image Composition */}
        <div className="lg:col-span-5 relative group">
          {/* Main Image Frame */}
          <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group-hover:shadow-[0_32px_64px_rgba(0,0,0,0.1)] transition-all duration-700">
            <img
              src="/aboutpage3.webp"
              alt="The Shaa David Philosophy"
              className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Glassy Overlay Label */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <p className="text-white font-malayalam font-bold text-lg md:text-xl leading-snug drop-shadow-md">
                "നിങ്ങളുടെ ഭാഷ, നിങ്ങളുടെ ആത്മവിശ്വാസം"
              </p>
            </div>
          </div>

          {/* Decorative Back Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0c1622] rounded-[40px] -z-0 transform rotate-12 transition-transform duration-700 group-hover:rotate-6"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 border-4 border-[#395c80]/20 rounded-full -z-0"></div>

          {/* Floating Icon */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center z-20 animate-bounce duration-[3000ms]">
            <img src="/icon.webp" alt="Icon" className="w-10 h-10 opacity-80 animate-[spin_30s_linear_infinite]" />
          </div>
        </div>

        {/* Right Side: Refined Content */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-md font-malayalam">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            ഞങ്ങളുടെ കാഴ്ചപ്പാട്
          </div>

          <h2 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-malayalam font-extrabold text-[#0c1622] mb-10 leading-[1.4] tracking-tight pt-4 -mt-4 pb-4 mb-4">
            ഇനി <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer">ഭയമില്ലാതെ ഇംഗ്ലീഷ് സംസാരിക്കാൻ</span> തുടങ്ങാം
          </h2>

          <div className="space-y-10 max-w-4xl">
            {/* Main Description */}
            <p className="text-gray-600 text-base md:text-lg xl:text-xl font-malayalam leading-[1.8] font-medium">
              ഷാ ഡേവിഡ്സ് ഇംഗ്ലീഷ് കംപാനിയൻ ഭാഷാദ്ധ്യപകനായ ഷാജി എം ഡേവിഡ് രൂപകല്പന ചെയ്ത അതുല്യമായ ഇംഗ്ലീഷ് പാഠ്യപദ്ധതിയാണ്. ഇംഗ്ലീഷിലെയും മലയാളത്തിലെയും നിരവധി ഗ്രന്ഥങ്ങൾ പരിശോധിച്ച് രണ്ട് ഭാഷയുടെയും സവിശേഷതകൾ മനസിലാക്കി തയ്യാറാക്കിയതാണ് ഈ പാഠ്യപദ്ധതി. മലയാളം മാതൃഭാഷ ആയി സംസാരിക്കുന്നവർക്ക് അവരുടെ മാതൃഭാഷയായ മലയാളത്തിലൂടെ ഇംഗ്ലീഷ് ഭാഷയുടെ ഘടനയെ മനസിലാക്കി ഇംഗ്ലീഷ് ഭാഷയിൽ പ്രാവിണ്യം നേടാൻ ഇത് സഹായിക്കുന്നു.
            </p>

            {/* Why English Companion Section with Glassy Box */}
            <div className="relative p-8 md:p-12 bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-xl overflow-hidden group transition-all duration-700">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#395c80]/10 rounded-full blur-[80px]"></div>

              <h3 className="text-xl md:text-2xl font-malayalam font-bold text-[#29425e] mb-8 flex items-center gap-4 relative z-10">
                <span className="w-10 h-10 rounded-2xl bg-[#29425e] text-white flex items-center justify-center shadow-lg transform -rotate-3">?</span>
                എന്ത്കൊണ്ട് ഇംഗ്ലീഷ് കംപാനിയൻ
              </h3>

              <div className="space-y-8 relative z-10">
                <p className="text-gray-600 text-sm md:text-base xl:text-lg font-malayalam leading-[1.8]">
                  ചുരുങ്ങിയ ദിവസങ്ങളിൽ ഇംഗ്ലീഷ് പഠിപ്പിക്കാമെന്ന് വാഗ്ദാനം ചെയ്യുന്ന പല ഭാഷാ പഠന പദ്ധതികളും നമുക്ക് ചുറ്റിനുമുണ്ട്. എന്നാൽ അവയിൽ മിക്കവാറും എല്ലാം തന്നെ സൂക്ഷ്മമായി നോക്കുമ്പോൾ പരിമിതമായ ചില സാഹചര്യങ്ങളിൽ പ്രയോഗിക്കേണ്ട വാക്കുകളും വാക്യങ്ങളും പഠിപ്പിച്ച് ഭാഷ പഠിച്ചു എന്ന തോന്നലുണ്ടാക്കുക മാത്രമാണ് ചെയ്യുന്നത്.
                </p>

                <div className="p-4 bg-[#29425e]/5 rounded-2xl border-l-4 border-[#29425e]">
                  <p className="text-[#29425e] text-sm md:text-base xl:text-lg font-malayalam leading-[1.8] font-semibold italic">
                    "ഫലപ്രദമായ ഭാഷാ പഠനം ഉത്പാദനക്ഷമമായിരിക്കണം — അതായത് എല്ലാ സന്ദർഭങ്ങളിലും പ്രയോഗിക്കേണ്ട വാക്കുകളും വാക്യങ്ങളും ഉപയോഗിക്കുവാൻ കഴിയുന്ന നിയമങ്ങൾ, ഭാഷ പഠിക്കുന്ന ഒരാൾ ആർജ്ജിക്കേണ്ടതുണ്ട്."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Badges - Malayalam & Premium Style */}
          <div className="flex flex-wrap gap-4 mt-12 w-full">
            {[
              { label: "ശാസ്ത്രീയ രീതി", icon: "Scientific Method" },
              { label: "വാക്യ നിർമ്മാണം", icon: "Sentence Building" },
              { label: "പ്രായോഗിക പരിശീലനം", icon: "Real-world Practice" }
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-white font-malayalam font-bold text-sm shadow-md hover:translate-y-[-4px] transition-all duration-300 cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
