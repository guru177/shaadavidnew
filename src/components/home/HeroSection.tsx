import Link from 'next/link';
import Globe3D from '@/components/Globe3D';

export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col xl:flex-row w-full relative xl:min-h-0 pb-4 md:pb-6 xl:pb-2">

      {/* Tablet Top Row Wrapper (Flattens on Desktop) */}
      <div className="flex flex-col lg:flex-row w-full xl:contents order-1 xl:order-none">

        {/* Left Column — right padding keeps headline clear of the book at 1300–1600 */}
        <div className="w-full lg:w-[62%] relative flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:pl-10 xl:pr-[36%] laptop:pl-12 laptop:pr-[34%] 2xl:pl-14 2xl:pr-[30%] laptop-wide:pl-16 laptop-wide:pr-[28%] py-2 md:py-4 xl:py-2 laptop:py-3 z-20 order-1 xl:order-none">

          {/* Main Headline */}
          <div className="flex flex-col font-malayalam-display leading-[1.5] xl:leading-[1.5] tracking-normal overflow-visible mt-2 md:mt-3 xl:mt-0 gap-1.5 md:gap-2 laptop:gap-2.5">
            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-[22px] sm:text-3xl md:text-3xl xl:text-[1.75rem] laptop:text-[1.9rem] 2xl:text-4xl laptop-wide:text-[2.5rem] font-semibold w-max max-w-full inline-block leading-[1.55]">
              ഷാ ഡേവിഡ്സ്
            </span>
            <span className="text-[#111111] text-[32px] xs:text-[36px] sm:text-[48px] md:text-6xl lg:text-7xl xl:text-[2.85rem] laptop:text-[3.25rem] 2xl:text-[4.15rem] laptop-wide:text-[5rem] font-bold leading-[1.35] sm:leading-[1.4]">
              ഇംഗ്ലീഷ്
            </span>
            <div className="relative inline-block w-max max-w-full mb-2 xl:mb-3 laptop:mb-4 2xl:mb-4 mt-0.5 overflow-visible">
              <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-[32px] xs:text-[36px] sm:text-[48px] md:text-6xl lg:text-7xl xl:text-[2.85rem] laptop:text-[3.25rem] 2xl:text-[4.15rem] laptop-wide:text-[5rem] font-bold leading-[1.35] sm:leading-[1.4] inline-block">
                കമ്പാനിയൻ
              </span>
              {/* Decorative underlines curved upwards */}
              <div
                className="absolute -bottom-1 left-0 w-[95%] h-[8px] md:h-[10px] xl:h-[10px] laptop-wide:h-[12px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer transform -rotate-[1deg] origin-left"
                style={{
                  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1,9 Q50,1 99,9' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  WebkitMaskSize: "100% 100%",
                  maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1,9 Q50,1 99,9' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  maskSize: "100% 100%",
                }}
              ></div>
              <div
                className="absolute -bottom-2 md:-bottom-3 left-[5%] w-[90%] h-[8px] md:h-[10px] xl:h-[10px] laptop-wide:h-[12px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer opacity-90 transform rotate-[1deg] origin-right"
                style={{
                  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1,9 Q50,1 99,9' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  WebkitMaskSize: "100% 100%",
                  maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1,9 Q50,1 99,9' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  maskSize: "100% 100%",
                }}
              ></div>
            </div>
            <span className="text-[#666666] text-[17px] sm:text-xl md:text-2xl xl:text-lg laptop:text-[1.25rem] 2xl:text-2xl laptop-wide:text-[1.75rem] font-malayalam font-medium mt-1 xl:mt-2 flex items-center gap-2">
              മലയാളത്തിലൂടെ English പഠിക്കാം
            </span>
          </div>

          {/* Bottom Left Action Area */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-5 xl:mt-6 laptop:mt-7 2xl:mt-8">
            <Link href="/about" className="h-[44px] sm:h-[48px] md:h-[52px] xl:h-[48px] laptop:h-[52px] 2xl:h-[56px] laptop-wide:h-[60px] w-auto px-5 sm:px-8 2xl:px-10 laptop-wide:px-12 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] bg-[position:0%_center] hover:animate-shimmer transition-all transform hover:scale-105 hover:brightness-110 text-white font-medium text-[13px] sm:text-sm xl:text-sm laptop:text-[0.95rem] 2xl:text-base laptop-wide:text-lg tracking-wide rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(41,66,94,0.3)] whitespace-nowrap">
              Know more
            </Link>

            <Link href="/product" className="h-[44px] sm:h-[48px] md:h-[52px] xl:h-[48px] laptop:h-[52px] 2xl:h-[56px] laptop-wide:h-[60px] w-auto pl-5 pr-3 sm:pl-8 sm:pr-4 2xl:pl-10 2xl:pr-5 laptop-wide:pl-12 laptop-wide:pr-6 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] bg-[position:0%_center] hover:animate-shimmer transition-all transform hover:scale-105 hover:brightness-110 text-white font-medium text-[13px] sm:text-sm xl:text-sm laptop:text-[0.95rem] 2xl:text-base laptop-wide:text-lg tracking-wide rounded-full flex items-center justify-center gap-2 sm:gap-4 shadow-[0_10px_30px_rgba(41,66,94,0.3)] whitespace-nowrap">
              <span>Buy product</span>
              <span className="bg-white/10 text-white p-1 sm:p-1.5 laptop-wide:p-2 rounded-lg backdrop-blur-sm">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 laptop-wide:w-5 laptop-wide:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
              </span>
            </Link>
          </div>

        </div>

        {/* 3D book — centered in the hero section on desktop */}
        <div className="relative xl:absolute xl:inset-0 z-30 xl:z-40 flex items-center justify-center pointer-events-none w-full lg:w-1/2 xl:w-full my-4 lg:my-0 order-2 xl:order-none">
          <div className="relative w-[min(100%,280px)] h-[min(100vw,280px)] xs:w-[min(100%,320px)] xs:h-[320px] sm:w-[min(100%,400px)] sm:h-[400px] md:w-[440px] md:h-[440px] lg:w-[460px] lg:h-[460px] xl:w-[420px] xl:h-[420px] laptop:w-[480px] laptop:h-[480px] 2xl:w-[580px] 2xl:h-[580px] laptop-wide:w-[640px] laptop-wide:h-[640px] pointer-events-auto lg:translate-y-2 xl:translate-y-0 xl:translate-x-0 mx-auto">
            <Globe3D />
          </div>
        </div>

      </div>

      {/* Right Column (Dark on mobile/tablet) */}
      <div className="w-full xl:w-[38%] relative flex flex-col items-center justify-center bg-[linear-gradient(135deg,#0c1622_0%,#29425e_100%)] xl:bg-transparent rounded-t-[40px] xl:rounded-none py-8 px-6 xl:py-4 laptop:py-6 2xl:py-8 xl:px-0 order-3 xl:order-none z-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] xl:shadow-none overflow-hidden xl:overflow-visible mt-4 md:mt-6 xl:mt-0">

        {/* Vertical Text "Shaa David" */}
        <div className="hidden xl:block absolute left-6 laptop:left-8 2xl:left-10 laptop-wide:left-14 top-50% -translate-x-1/2 -rotate-90 z-20">
          <span className="font-montserrat text-white opacity-50 text-4xl xl:text-5xl laptop:text-5xl 2xl:text-6xl laptop-wide:text-7xl font-extrabold tracking-wide drop-shadow-lg whitespace-nowrap">
            SHAA DAVID
          </span>
        </div>

        {/* Huge Background Text */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-90 origin-right translate-x-[40%] opacity-10 pointer-events-none">
          <span className="font-michroma text-[5rem] lg:text-[7rem] xl:text-[6.5rem] laptop:text-[7.5rem] 2xl:text-[8.5rem] laptop-wide:text-[10rem] text-white tracking-[0.2em] uppercase whitespace-nowrap">Testing</span>
        </div>

        {/* Glassy Feature Cards */}
        <div className="relative flex flex-col md:flex-row xl:flex-col gap-4 xl:gap-3 laptop:gap-3.5 2xl:gap-5 laptop-wide:gap-6 w-full sm:w-[80%] md:w-full lg:w-[80%] xl:w-[70%] laptop:w-[65%] 2xl:w-[60%] laptop-wide:w-[55%] max-w-[400px] md:max-w-none xl:max-w-[250px] laptop:max-w-[275px] 2xl:max-w-[320px] laptop-wide:max-w-[380px] z-30 mx-auto xl:ml-auto xl:mr-5 laptop:mr-6 2xl:mr-10 laptop-wide:mr-14 mt-2 xl:mt-4 laptop:mt-6 2xl:mt-8">

          {/* Card 1 */}
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 lg:p-5 xl:p-3.5 laptop:p-4 2xl:p-5 laptop-wide:p-5 shadow-2xl hover:bg-white/15 transition-all">
            <h3 className="text-white font-malayalam font-bold text-base lg:text-lg xl:text-[0.8125rem] laptop:text-sm 2xl:text-base laptop-wide:text-xl mb-1.5 xl:mb-1 laptop:mb-1.5 2xl:mb-2 leading-[1.55]">
              Grammar ഭയങ്ങളില്ലാതെ പഠനം
            </h3>
            <p className="text-white/70 font-malayalam text-sm lg:text-sm xl:text-[10.5px] laptop:text-[11px] 2xl:text-sm laptop-wide:text-base leading-[1.65]">
              വ്യാകരണ നിയമങ്ങളെ പേടിക്കാതെ വളരെ ലളിതമായി ഇംഗ്ലീഷ് സംസാരിക്കാൻ പഠിക്കാം. ദൈനംദിന ജീവിതത്തിൽ ഉപയോഗിക്കുന്ന ഇംഗ്ലീഷ് എളുപ്പത്തിൽ സ്വായത്തമാക്കാം.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 lg:p-5 xl:p-3.5 laptop:p-4 2xl:p-5 laptop-wide:p-5 shadow-2xl hover:bg-white/15 transition-all">
            <h3 className="text-white font-malayalam font-bold text-base lg:text-lg xl:text-[0.8125rem] laptop:text-sm 2xl:text-base laptop-wide:text-xl mb-1.5 xl:mb-1 laptop:mb-1.5 2xl:mb-2 leading-[1.55]">
              Beginners-നുള്ള Easy-to-Follow Format
            </h3>
            <p className="text-white/70 font-malayalam text-sm lg:text-sm xl:text-[10.5px] laptop:text-[11px] 2xl:text-sm laptop-wide:text-base leading-[1.65]">
              ഇംഗ്ലീഷ് ഒട്ടും അറിയാത്തവർക്കും എളുപ്പത്തിൽ മനസ്സിലാകുന്ന രീതിയിലാണ് ക്ലാസുകൾ ക്രമീകരിച്ചിരിക്കുന്നത്. നിങ്ങളുടെ സ്വന്തം വേഗതയിൽ പഠിച്ചു മുന്നേറാം.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
