import Globe3D from '@/components/Globe3D';

export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col xl:flex-row w-full relative xl:min-h-0">
      
      {/* Tablet Top Row Wrapper (Flattens on Desktop) */}
      <div className="flex flex-col md:flex-row w-full xl:contents order-1 xl:order-none">

        {/* Left Column (White) */}
        <div className="w-full md:w-1/2 xl:w-[62%] relative flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 md:py-10 xl:py-0 z-20 order-1 md:order-1 xl:order-none">

          {/* Main Headline */}
          <div className="flex flex-col font-malayalam leading-[1.2] xl:leading-[1.3] tracking-tight xl:mt-[-5%] gap-2 md:gap-4">
            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-lg sm:text-xl md:text-2xl xl:text-3xl font-semibold w-max inline-block pt-4 -mt-4 pb-2 -mb-2">
              ഷാ ഡേവിഡ്സ്
            </span>
            <span className="text-[#111111] text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-extrabold">
              ഇംഗ്ലീഷ്
            </span>
            <div className="relative inline-block w-max mb-4 xl:mb-6 mt-1 xl:mt-2">
              <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-extrabold pb-2">
                കമ്പാനിയൻ
              </span>
              {/* Decorative underlines curved upwards */}
              <div
                className="absolute -bottom-1 left-0 w-[95%] h-[8px] md:h-[10px] xl:h-[12px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer transform -rotate-[1deg] origin-left"
                style={{
                  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1,9 Q50,1 99,9' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  WebkitMaskSize: "100% 100%",
                  maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1,9 Q50,1 99,9' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  maskSize: "100% 100%",
                }}
              ></div>
              <div
                className="absolute -bottom-2 md:-bottom-3 left-[5%] w-[90%] h-[8px] md:h-[10px] xl:h-[12px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer opacity-90 transform rotate-[1deg] origin-right"
                style={{
                  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1,9 Q50,1 99,9' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  WebkitMaskSize: "100% 100%",
                  maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1,9 Q50,1 99,9' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  maskSize: "100% 100%",
                }}
              ></div>
            </div>
            <span className="text-[#666666] text-base sm:text-lg md:text-lg xl:text-2xl font-medium mt-1 xl:mt-2 flex items-center gap-2">
              മലയാളത്തിലൂടെ English പഠിക്കാം
            </span>
          </div>

          {/* Bottom Left Action Area */}
          <div className="flex flex-row items-center gap-3 sm:gap-6 mt-8 xl:mt-10">
            <button className="h-[46px] sm:h-[50px] md:h-[54px] w-auto px-5 sm:px-8 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] bg-[position:0%_center] hover:animate-shimmer transition-all transform hover:scale-105 hover:brightness-110 text-white font-medium text-[13px] sm:text-sm tracking-wide rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(41,66,94,0.3)] whitespace-nowrap">
              Know more
            </button>

            <button className="h-[46px] sm:h-[50px] md:h-[54px] w-auto pl-5 pr-3 sm:pl-8 sm:pr-4 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] bg-[position:0%_center] hover:animate-shimmer transition-all transform hover:scale-105 hover:brightness-110 text-white font-medium text-[13px] sm:text-sm tracking-wide rounded-full flex items-center justify-center gap-2 sm:gap-4 shadow-[0_10px_30px_rgba(41,66,94,0.3)] whitespace-nowrap">
              <span>View product</span>
              <span className="bg-white/10 text-white p-1 sm:p-1.5 rounded-lg backdrop-blur-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
              </span>
            </button>
          </div>

        </div>

        {/* 3D WebGL Globe - Responsive positioned */}
        <div className="relative xl:absolute xl:inset-0 z-30 xl:z-[100] flex items-center justify-center pointer-events-none w-full md:w-1/2 xl:w-full my-8 md:my-0 xl:my-0 order-2 md:order-2 xl:order-none">
          <div className="relative w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] xl:w-[600px] xl:h-[600px] pointer-events-auto xl:translate-x-16 2xl:translate-x-20">
            <Globe3D />
          </div>
        </div>

      </div>

      {/* Right Column (Dark on mobile/tablet) */}
      <div className="w-full xl:w-[38%] relative flex flex-col items-center justify-center bg-[#353941] xl:bg-transparent rounded-t-[40px] xl:rounded-none py-12 px-6 xl:py-0 xl:px-0 order-3 xl:order-none z-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] xl:shadow-none overflow-hidden xl:overflow-visible mt-6 md:mt-10 xl:mt-0">
        
        {/* Vertical Text "Shaa David" - Hidden on mobile/tablet */}
        <div className="hidden xl:block absolute left-10 xl:left-14 top-50% -translate-x-1/2 -translate-y-1/2 -rotate-90 z-20">
          <span className="font-montserrat text-white opacity-50 text-5xl xl:text-7xl font-extrabold tracking-wide drop-shadow-lg whitespace-nowrap">
            SHAA DAVID
          </span>
        </div>

        {/* Huge Background Text - Scaled on mobile/tablet */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-90 origin-right translate-x-[40%] opacity-10 pointer-events-none">
          <span className="font-michroma text-[5rem] lg:text-[7rem] xl:text-[9rem] text-white tracking-[0.2em] uppercase whitespace-nowrap">Testing</span>
        </div>

        {/* Glassy Feature Cards */}
        <div className="relative flex flex-col md:flex-row xl:flex-col gap-4 xl:gap-4 w-full sm:w-[80%] md:w-full lg:w-[80%] xl:w-[55%] max-w-[400px] md:max-w-none xl:max-w-[320px] z-30 mx-auto xl:ml-auto xl:mr-10 xl:mt-0 mt-6">

          {/* Card 1 */}
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 lg:p-5 xl:p-5 shadow-2xl hover:bg-white/15 transition-all">
            <h3 className="text-white font-malayalam font-bold text-base lg:text-lg xl:text-base mb-1.5 xl:mb-2 leading-snug">
              Grammar ഭയങ്ങളില്ലാതെ പഠനം
            </h3>
            <p className="text-white/70 font-malayalam text-sm lg:text-sm xl:text-xs leading-relaxed">
              വ്യാകരണ നിയമങ്ങളെ പേടിക്കാതെ വളരെ ലളിതമായി ഇംഗ്ലീഷ് സംസാരിക്കാൻ പഠിക്കാം. ദൈനംദിന ജീവിതത്തിൽ ഉപയോഗിക്കുന്ന ഇംഗ്ലീഷ് എളുപ്പത്തിൽ സ്വായത്തമാക്കാം.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 lg:p-5 xl:p-5 shadow-2xl hover:bg-white/15 transition-all">
            <h3 className="text-white font-malayalam font-bold text-base lg:text-lg xl:text-base mb-1.5 xl:mb-2 leading-snug">
              Beginners-നുള്ള Easy-to-Follow Format
            </h3>
            <p className="text-white/70 font-malayalam text-sm lg:text-sm xl:text-xs leading-relaxed">
              ഇംഗ്ലീഷ് ഒട്ടും അറിയാത്തവർക്കും എളുപ്പത്തിൽ മനസ്സിലാകുന്ന രീതിയിലാണ് ക്ലാസുകൾ ക്രമീകരിച്ചിരിക്കുന്നത്. നിങ്ങളുടെ സ്വന്തം വേഗതയിൽ പഠിച്ചു മുന്നേറാം.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
