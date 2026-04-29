export default function AboutHero() {
  return (
    <section className="relative w-full pt-0 pb-[80px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-1/2 flex flex-col z-10 relative">
          <div className="inline-flex items-center justify-center px-5 py-2 rounded-full text-white font-bold tracking-widest uppercase mb-6 text-xs md:text-sm font-malayalam bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-md w-fit">
            ഞങ്ങളുടെ ലക്ഷ്യം
          </div>
          <h1 className="text-4xl md:text-6xl 2xl:text-5xl font-extrabold text-[#0c1622] mb-6 leading-tight drop-shadow-sm font-malayalam">
            ഇംഗ്ലീഷ് സംസാരിക്കാം <br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer">ആത്മവിശ്വാസത്തോടെ</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl 2xl:text-xl leading-relaxed font-medium mb-10 max-w-2xl font-malayalam">
            ഭാഷ ഒരു തടസ്സമാകരുത്, അതൊരു പാലമായിരിക്കണം. വ്യാകരണത്തെക്കുറിച്ചുള്ള ഭയമില്ലാതെ, തികഞ്ഞ ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് സംസാരിക്കാൻ ഓരോ മലയാളിയേയും സഹായിക്കുക എന്നതാണ് ഷാ ഡേവിഡിന്റെ ലക്ഷ്യം.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-black text-[#0c1622]">99%</span>
              <span className="text-gray-500 font-medium text-sm md:text-base">Success Rate</span>
            </div>
            <div className="w-[1px] h-12 bg-gray-300"></div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-black text-[#0c1622]">10k+</span>
              <span className="text-gray-500 font-medium text-sm md:text-base">Students Taught</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative z-10">
          <div className="relative w-full aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl">
            <img
              src="/about.jpg"
              alt="Shaa David About"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Floating accent image */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 md:w-64 md:h-64 rounded-[30px] overflow-hidden shadow-2xl border-4 border-white hidden sm:block transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <img
              src="/about2.jpg"
              alt="Students"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
