import React from 'react';

export default function AboutFounder() {
  return (
    <section className="relative w-full py-[100px] xl:py-[140px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto bg-gray-50/50 z-20 overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#395c80]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-center">

        {/* Left Side: Biography Content */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-md font-malayalam">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            സ്ഥാപകനെ പരിചയപ്പെടാം
          </div>

          <h2 className="text-4xl md:text-5xl xl:text-6xl font-malayalam font-extrabold text-[#0c1622] tracking-tight relative pt-4 pb-4">
            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer">
              ഷാജി എം ഡേവിഡ്
            </span>
          </h2>

          <div className="space-y-6 text-gray-600 text-base md:text-lg xl:text-xl font-malayalam leading-[1.8] font-medium max-w-4xl">
            <p>
              ഷാജി എം ഡേവിഡ് ഇടുക്കി ജില്ലയിലുള്ള മലയോര ഗ്രാമമായ ചേറ്റുകുഴി എന്ന സ്ഥലത്ത് ജനനം. പ്രാഥമിക വിദ്യാഭ്യാസത്തിന് ശേഷം ഔപചാരിക വിദ്യാഭ്യാസം തുടരാൻ കഴിഞ്ഞില്ല. അങ്ങനെയുണ്ടാകുമ്പോൾ ഇംഗ്ലീഷ് അധ്യാപകനായ പി ജെ തോമസുാറിന്റെ സ്പോക്കൺ ഇംഗ്ലീഷ് ക്ലാസ് കൂട്ടാൻ ഇടയായി.
            </p>
            <p>
              ഇംഗ്ലീഷിനോട് അത് വരെ ഉണ്ടായിരുന്ന പേടി മാറുകയും അന്ന് മുതൽ ഇംഗ്ലീഷ് ഭാഷ ഇഷ്ടപ്പെടുകയും കൂടുതൽ പഠിക്കാൻ ശ്രമിക്കുകയും ചെയ്തു. ഇംഗ്ലീഷ് പഠിച്ചു തുടങ്ങി ഒരു വർഷത്തിനുള്ളിൽ ഒരു സ്വകാര്യ സ്ഥാപനത്തിൽ ഇംഗ്ലീഷ് പഠിപ്പിക്കാൻ ആരംഭിക്കുന്നു.
            </p>
            <p>
              സ്വന്തമായി ഇംഗ്ലീഷ് പഠിച്ചു തുടങ്ങിയപ്പോൾ ലഭിച്ച ഉൾകാഴ്ചകളും വിവിധ നിലയിൽ ഉള്ളവരെ ഭാഷ പഠിപ്പിച്ച അനുഭവസമ്പത്തും കൂടാതെ ഇംഗ്ലീഷിലെയും മലയാളത്തിലെയും നിരവധി വ്യാകരണ ഗ്രന്ഥങ്ങൾ പരിശോധിച്ചും മലയാളത്തിലൂടെ ഇംഗ്ലീഷ് പഠിക്കാൻ സഹായിക്കുന്ന ഒരു പാഠ്യ പദ്ധതി തയ്യാറാക്കുകയും ഷാ ഡേവിഡ്സ് ഇംഗ്ലീഷ് കംപാനിയൻ എന്ന പേരിൽ പുസ്തക രൂപത്തിൽ പ്രസിദ്ധീകരിക്കുകയും ചെയ്തു.
            </p>
            <p>
              ഇപ്പോൾ സ്വന്തമായി വികസിപ്പിച്ചെടുത്ത ഷാ ഡേവിഡ്സ് ഇംഗ്ലീഷ് കംപാനിയൻ എന്ന പദ്ധതിയുടെ പ്രചരണവും ഭാഷ വൈദഗ്ധ്യ വികസന സെമിനാറുകളും നടത്തി വരുന്നു.
            </p>
          </div>

          {/* Contact Highlight */}
          <div className="mt-12 p-6 md:p-8 bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col md:flex-row items-center gap-6 group hover:border-[#395c80]/30 transition-all duration-500 max-w-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="flex flex-col text-center md:text-left">
              <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 font-malayalam">നേരിട്ട് ബന്ധപ്പെടാം</p>
              <p className="text-2xl md:text-3xl font-malayalam font-extrabold text-[#0c1622]">കോണ്ടാക്ട്: 7907075923</p>
            </div>
            <button className="ml-auto w-12 h-12 rounded-full bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-white flex items-center justify-center hover:scale-110 shadow-md transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side: Portrait Frame */}
        <div className="lg:col-span-5 order-1 lg:order-2 relative">
          <div className="relative z-10 rounded-[50px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[12px] border-white transform lg:rotate-3 hover:rotate-0 transition-all duration-700">
            <img
              src="/author.jpg"
              alt="Shaji M. David"
              className="w-full aspect-[4/5] object-cover"
            />
            {/* Glassy Signature Overlay */}
            <div className="absolute top-6 right-6 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer border border-white/20 px-6 py-2 rounded-full shadow-lg">
              <p className="text-white font-malayalam font-bold text-xs md:text-sm tracking-wide">Founder & Author</p>
            </div>
          </div>

          {/* Decorative accents */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 border-4 border-[#395c80]/20 rounded-[60px] -z-0 transform -rotate-12"></div>

          {/* Quote element */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl z-20 max-w-[200px] animate-bounce duration-[5000ms]">
            <p className="text-[#0c1622] font-malayalam font-bold text-sm leading-relaxed">
              "ഭാഷാ പഠനം ഒരു ആനന്ദമാകട്ടെ"
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
