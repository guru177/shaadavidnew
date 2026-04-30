import React from 'react';

export default function TestimonialSection() {
  const testimonials = [
    {
      text: "വളരെ ലളിതമായ രീതിയിലാണ് കാര്യങ്ങൾ വിശദീകരിക്കുന്നത്. ജോലിസ്ഥലത്ത് എനിക്ക് ഇപ്പോൾ വലിയ ആത്മവിശ്വാസമുണ്ട്.",
      author: "അഞ്ജലി മോഹൻ",
      role: "HR Manager",
      initials: "AM",
      color: "29425e"
    },
    {
      text: "ഇത്രയും നല്ലൊരു ഇംഗ്ലീഷ് കോഴ്‌സ് ഞാൻ ഇതുവരെ കണ്ടിട്ടില്ല. ഓരോ പാഠവും വളരെ ഉപകാരപ്രദമാണ്.",
      author: "വിഷ്ണു പ്രസാദ്",
      role: "College Student",
      initials: "VP",
      color: "395c80"
    },
    {
      text: "തുടക്കക്കാർക്ക് പഠിക്കാൻ ഏറ്റവും മികച്ച പ്ലാറ്റ്‌ഫോം. എന്റെ ഭാഷാശേഷി വളരെ വേഗം മെച്ചപ്പെട്ടു.",
      author: "സ്നേഹ ജോർജ്",
      role: "Teacher",
      initials: "SG",
      color: "0c1622"
    }
  ];

  return (
    <section className="relative w-full bg-[#FAFAFA] py-[80px] md:py-[100px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto overflow-hidden">


      <div className="flex flex-col items-start mb-12">
        <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] md:text-xs font-black text-white mb-6 shadow-md hover:shadow-lg transition-all cursor-default bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer font-malayalam uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          വിദ്യാർത്ഥികൾ പറയുന്നത്
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16 items-center">

        {/* Left Column: Title & Description (Span 4) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col items-start lg:pr-4">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl 2xl:text-5xl font-malayalam font-extrabold text-[#111] leading-[1.4] tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer">1000-ൽ പരം</span> ആളുകൾ ഞങ്ങളെ വിശ്വസിക്കുന്നു
          </h2>
          <p className="text-gray-600 text-lg 2xl:text-xl font-malayalam leading-[1.8] mb-8">
            ഇംഗ്ലീഷ് പഠനം എളുപ്പമാക്കാൻ നൂറുകണക്കിന് വിദ്യാർത്ഥികളും പ്രൊഫഷണലുകളും ഷാ ഡേവിഡ് തിരഞ്ഞെടുക്കുന്നു.
          </p>
        </div>

        {/* Middle Column: Large Image Card (Span 4) */}
        <div className="col-span-1 lg:col-span-4 relative w-full aspect-[4/3] xs:aspect-[16/10] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[24px] 2xl:rounded-[30px] overflow-hidden shadow-lg group">
          <img loading="lazy"
            src="/testi.jpg"
            alt="Happy Student"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 2xl:p-10 flex flex-col justify-end">
            <p className="text-white text-lg xs:text-xl sm:text-2xl 2xl:text-3xl font-malayalam font-bold leading-[1.4] mb-4 sm:mb-6">
              ഷാ ഡേവിഡിന്റെ ഇംഗ്ലീഷ് കംപാനിയൻ—ഭയം നീക്കി ആത്മവിശ്വാസത്തോടെ സംസാരിക്കാൻ സഹായിക്കുന്നു.
            </p>
          </div>
        </div>

        {/* Right Column: Scrolling Stack of Cards (Span 4) */}
        <div
          className="col-span-1 lg:col-span-4 relative h-[400px] sm:h-[500px] lg:h-[600px] 2xl:h-[700px] overflow-hidden group"
          style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 75%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 75%, transparent 100%)' }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes scrollVertical {
              0% { transform: translateY(0); }
              100% { transform: translateY(calc(-50% - 12px)); }
            }
            @media (min-width: 1536px) {
              @keyframes scrollVertical {
                0% { transform: translateY(0); }
                100% { transform: translateY(calc(-50% - 16px)); }
              }
            }
            .animate-scroll-vertical {
              animation: scrollVertical 20s linear infinite;
            }
          `}} />

          <div className="flex flex-col gap-6 2xl:gap-8 animate-scroll-vertical group-hover:[animation-play-state:paused] absolute top-0 left-0 w-full">
            {[...testimonials, ...testimonials].map((test, idx) => (
              <div key={idx} className="bg-white rounded-[20px] 2xl:rounded-[24px] p-6 2xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex-shrink-0 mx-1">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 2xl:w-5 2xl:h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-base 2xl:text-lg font-malayalam leading-[1.6] mb-6">
                  "{test.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img loading="lazy" src={`https://ui-avatars.com/api/?name=${test.author.replace(' ', '+')}&background=${test.color}&color=fff`} alt={test.author} className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-[#111] font-bold font-malayalam text-sm 2xl:text-base">{test.author}</h4>
                    <p className="text-xs 2xl:text-sm text-gray-500">{test.role}</p>
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
