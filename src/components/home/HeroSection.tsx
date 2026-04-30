import Link from 'next/link';
import Globe3D from '@/components/Globe3D';

export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col xl:flex-row w-full relative xl:min-h-0">

      {/* Tablet Top Row Wrapper (Flattens on Desktop) */}
      <div className="flex flex-col lg:flex-row w-full xl:contents order-1 xl:order-none">

        {/* Left Column (White) */}
        <div className="w-full lg:w-[62%] relative flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 md:py-10 xl:py-0 z-20 order-1 xl:order-none">

          {/* Main Headline */}
          <div className="flex flex-col font-malayalam leading-[1.3] xl:leading-[1.4] tracking-tight mt-20 md:mt-24 xl:mt-12 gap-6 md:gap-4">
            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-[22px] sm:text-3xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold w-max inline-block pt-4 -mt-4 pb-2 leading-normal">
              ഷാ ഡേവിഡ്സ്
            </span>
            <span className="text-[#111111] text-[48px] sm:text-[60px] md:text-6xl lg:text-7xl xl:text-[5rem] 2xl:text-[7.5rem] font-extrabold leading-[1.2]">
              ഇംഗ്ലീഷ്
            </span>
            <div className="relative inline-block w-max mb-4 xl:mb-6 mt-1 xl:mt-2">
              <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-[48px] sm:text-[60px] md:text-6xl lg:text-7xl xl:text-[5rem] 2xl:text-[7.5rem] font-extrabold pb-2 leading-[1.2]">
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
            <span className="text-[#666666] text-[18px] sm:text-2xl md:text-2xl xl:text-3xl 2xl:text-4xl font-medium mt-2 xl:mt-4 2xl:mt-6 flex items-center gap-2">
              മലയാളത്തിലൂടെ English പഠിക്കാം
            </span>
          </div>

          {/* Bottom Left Action Area */}
          <div className="flex flex-row items-center gap-3 sm:gap-6 mt-8 xl:mt-10">
            <Link href="/about" className="h-[46px] sm:h-[50px] md:h-[54px] xl:h-[60px] 2xl:h-[70px] w-auto px-5 sm:px-8 2xl:px-12 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] bg-[position:0%_center] hover:animate-shimmer transition-all transform hover:scale-105 hover:brightness-110 text-white font-medium text-[13px] sm:text-sm xl:text-base 2xl:text-lg tracking-wide rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(41,66,94,0.3)] whitespace-nowrap">
              Know more
            </Link>

            <Link href="/product" className="h-[46px] sm:h-[50px] md:h-[54px] xl:h-[60px] 2xl:h-[70px] w-auto pl-5 pr-3 sm:pl-8 sm:pr-4 2xl:pl-12 2xl:pr-6 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] bg-[position:0%_center] hover:animate-shimmer transition-all transform hover:scale-105 hover:brightness-110 text-white font-medium text-[13px] sm:text-sm xl:text-base 2xl:text-lg tracking-wide rounded-full flex items-center justify-center gap-2 sm:gap-4 shadow-[0_10px_30px_rgba(41,66,94,0.3)] whitespace-nowrap">
              <span>Buy product</span>
              <span className="bg-white/10 text-white p-1 sm:p-1.5 2xl:p-2 rounded-lg backdrop-blur-sm">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
              </span>
            </Link>
          </div>

        </div>

        {/* 3D WebGL Globe - Responsive positioned */}
        <div className="relative xl:absolute xl:inset-0 z-30 xl:z-40 flex items-center justify-center pointer-events-none w-full lg:w-1/2 xl:w-full my-8 lg:my-0 order-2 xl:order-none">
          <div className="relative w-[300px] h-[300px] xs:w-[350px] xs:h-[350px] sm:w-[500px] sm:h-[500px] md:w-[450px] md:h-[450px] lg:w-[450px] lg:h-[450px] xl:w-[600px] xl:h-[600px] 2xl:w-[800px] 2xl:h-[800px] pointer-events-auto lg:translate-y-8 xl:translate-y-12 2xl:translate-y-16 xl:translate-x-16 2xl:translate-x-20">
            <Globe3D />
          </div>
        </div>

      </div>

      {/* Right Column (Dark on mobile/tablet) */}
      <div className="w-full xl:w-[38%] relative flex flex-col items-center justify-center bg-[linear-gradient(135deg,#0c1622_0%,#29425e_100%)] xl:bg-transparent rounded-t-[40px] xl:rounded-none py-12 px-6 xl:py-0 xl:px-0 order-3 xl:order-none z-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] xl:shadow-none overflow-hidden xl:overflow-visible mt-6 md:mt-10 xl:mt-0">

        {/* Vertical Text "Shaa David" - Hidden on mobile/tablet */}
        <div className="hidden xl:block absolute left-10 xl:left-14 top-50% -translate-x-1/2 -rotate-90 z-20">
          <span className="font-montserrat text-white opacity-50 text-5xl xl:text-7xl 2xl:text-9xl font-extrabold tracking-wide drop-shadow-lg whitespace-nowrap">
            SHAA DAVID
          </span>
        </div>

        {/* Huge Background Text - Scaled on mobile/tablet */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-90 origin-right translate-x-[40%] opacity-10 pointer-events-none">
          <span className="font-michroma text-[5rem] lg:text-[7rem] xl:text-[9rem] 2xl:text-[12rem] text-white tracking-[0.2em] uppercase whitespace-nowrap">Testing</span>
        </div>

        {/* Glassy Feature Cards */}
        <div className="relative flex flex-col md:flex-row xl:flex-col gap-4 xl:gap-4 2xl:gap-8 w-full sm:w-[80%] md:w-full lg:w-[80%] xl:w-[55%] max-w-[400px] md:max-w-none xl:max-w-[320px] 2xl:max-w-[450px] z-30 mx-auto xl:ml-auto xl:mr-10 2xl:mr-16 xl:mt-0 mt-6">

          {/* Card 1 */}
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 lg:p-5 xl:p-5 shadow-2xl hover:bg-white/15 transition-all">
            <h3 className="text-white font-malayalam font-bold text-base lg:text-lg xl:text-base 2xl:text-2xl mb-1.5 xl:mb-2 2xl:mb-4 leading-snug">
              Grammar ഭയങ്ങളില്ലാതെ പഠനം
            </h3>
            <p className="text-white/70 font-malayalam text-sm lg:text-sm xl:text-xs 2xl:text-xl leading-relaxed">
              വ്യാകരണ നിയമങ്ങളെ പേടിക്കാതെ വളരെ ലളിതമായി ഇംഗ്ലീഷ് സംസാരിക്കാൻ പഠിക്കാം. ദൈനംദിന ജീവിതത്തിൽ ഉപയോഗിക്കുന്ന ഇംഗ്ലീഷ് എളുപ്പത്തിൽ സ്വായത്തമാക്കാം.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 lg:p-5 xl:p-5 shadow-2xl hover:bg-white/15 transition-all">
            <h3 className="text-white font-malayalam font-bold text-base lg:text-lg xl:text-base 2xl:text-2xl mb-1.5 xl:mb-2 2xl:mb-4 leading-snug">
              Beginners-നുള്ള Easy-to-Follow Format
            </h3>
            <p className="text-white/70 font-malayalam text-sm lg:text-sm xl:text-xs 2xl:text-xl leading-relaxed">
              ഇംഗ്ലീഷ് ഒട്ടും അറിയാത്തവർക്കും എളുപ്പത്തിൽ മനസ്സിലാകുന്ന രീതിയിലാണ് ക്ലാസുകൾ ക്രമീകരിച്ചിരിക്കുന്നത്. നിങ്ങളുടെ സ്വന്തം വേഗതയിൽ പഠിച്ചു മുന്നേറാം.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
