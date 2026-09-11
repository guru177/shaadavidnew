export default function AboutHero() {
  return (
    <section className="relative w-full pt-[100px] md:pt-[140px] xl:pt-[160px] pb-[80px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto overflow-x-clip">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
        <div className="w-full md:w-1/2 flex flex-col z-10 relative min-w-0 overflow-visible">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-white font-bold tracking-wide mb-5 sm:mb-6 text-[11px] sm:text-xs font-malayalam bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-md w-fit max-w-full">
            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-white animate-pulse" />
            <span className="leading-none py-0.5">ഞങ്ങളുടെ ലക്ഷ്യം</span>
          </div>

          {/*
            Fluid type sized for half-column width from md up so long Malayalam
            words stay fully visible without mid-word breaks or clipping.
          */}
          <h1 className="mb-5 sm:mb-6 font-malayalam-display font-bold text-[#0c1622] drop-shadow-sm overflow-visible leading-[1.5] text-[clamp(1.7rem,calc(1rem+3.2vw),2.65rem)] md:text-[clamp(1.9rem,calc(0.75rem+2.35vw),2.75rem)] lg:text-[clamp(2.15rem,calc(0.9rem+2.2vw),3.15rem)] xl:text-[clamp(2rem,calc(0.9rem+1.6vw),3.1rem)] 2xl:text-[3rem]">
            <span className="block">ഇംഗ്ലീഷ് സംസാരിക്കാം</span>
            <span className="mt-1.5 block text-[0.92em] md:text-[0.88em] lg:text-[0.9em] text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer">
              ആത്മവിശ്വാസത്തോടെ
            </span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-[1.35rem] xl:text-xl leading-[1.75] sm:leading-[1.8] font-medium mb-8 sm:mb-10 max-w-2xl font-malayalam">
            ഭാഷ ഒരു തടസ്സമാകരുത്, അതൊരു പാലമായിരിക്കണം. വ്യാകരണത്തെക്കുറിച്ചുള്ള ഭയമില്ലാതെ,
            തികഞ്ഞ ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് സംസാരിക്കാൻ ഓരോ മലയാളിയേയും സഹായിക്കുക എന്നതാണ് ഷാ
            ഡേവിഡിന്റെ ലക്ഷ്യം.
          </p>

          <div className="flex items-center gap-5 sm:gap-6">
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-[#0c1622]">99%</span>
              <span className="text-gray-500 font-medium text-xs sm:text-sm md:text-base">Success Rate</span>
            </div>
            <div className="w-px h-10 sm:h-12 bg-gray-300" />
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-[#0c1622]">10k+</span>
              <span className="text-gray-500 font-medium text-xs sm:text-sm md:text-base">Students Taught</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative z-10 min-w-0">
          <div className="relative w-full aspect-[4/3] rounded-[28px] sm:rounded-[40px] overflow-hidden shadow-2xl">
            <img
              src="/aboutpage1.webp"
              alt="Shaa David About"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="absolute -bottom-8 -left-4 sm:-bottom-10 sm:-left-6 md:-left-8 w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-[24px] sm:rounded-[30px] overflow-hidden shadow-2xl border-4 border-white hidden sm:block transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <img src="/aboutpage2.webp" alt="Students" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
