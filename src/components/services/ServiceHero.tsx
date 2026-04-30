import React from 'react';

export default function ServiceHero() {
  return (
    <section className="relative w-full pt-[140px] md:pt-[180px] xl:pt-[220px] pb-[80px] md:pb-[120px] px-5 md:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto overflow-hidden">

      {/* Refined Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#395c80]/5 rounded-full blur-[150px] translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">

        {/* Left Side: Elegant Editorial Content */}
        <div className="w-full lg:w-[55%] flex flex-col items-start">
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] md:text-xs font-black text-white mb-8 shadow-md bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer font-malayalam uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            വിദഗ്ദ്ധ സേവനം
          </div>

          <h1 className="text-4xl md:text-6xl 2xl:text-7xl font-malayalam font-extrabold text-[#0c1622] mb-10 leading-[1.4] tracking-tight">
            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer pb-2 block">
              വിദ്യാഭ്യാസവും
            </span>
            കൗൺസിലിംഗും
          </h1>

          <div className="relative mb-12">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#395c80] to-transparent rounded-full opacity-20"></div>
            <p className="text-gray-600 text-lg md:text-xl xl:text-2xl font-malayalam font-medium leading-[1.8] max-w-2xl pl-2">
              വിദ്യാർത്ഥികളുടെ വ്യക്തിത്വ വികാസത്തിനും, പഠന വൈകല്യങ്ങൾ തിരിച്ചറിയാനും, മാതാപിതാക്കൾക്ക് ശരിയായ മാർഗ്ഗനിർദ്ദേശം നൽകാനും ഞങ്ങൾ ഒപ്പമുണ്ട്.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-6 items-start sm:items-center">
            <a href="tel:+918891337811" className="flex items-center gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer text-white rounded-full font-bold shadow-[0_20px_40px_rgba(41,66,94,0.25)] hover:scale-105 transition-all group whitespace-nowrap">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>സൗജന്യ കൗൺസിലിംഗ്</span>
            </a>
            
            <div className="flex items-center gap-4 whitespace-nowrap">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm flex-shrink-0">
                    <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0c1622] flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">+500</div>
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Happy Parents</p>
            </div>
          </div>
        </div>

        {/* Right Side: Elegant Asymmetrical Frame */}
        <div className="w-full lg:w-[45%] relative group">
          {/* Main Sqaure Image with Double Frame */}
          <div className="relative z-10 p-4 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.08)] rounded-[40px] transform hover:-rotate-1 transition-all duration-700">
            <div className="rounded-[30px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" 
                alt="Professional Counseling" 
                className="w-full aspect-square object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            {/* Elegant Signature Badge */}
            <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-[30px] sm:rounded-[40px] shadow-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center border border-gray-50 animate-bounce-slow">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#395c80] mb-0.5 sm:mb-1">10+</span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight font-malayalam">വർഷത്തെ <br /> പാരമ്പര്യം</span>
              <div className="absolute -top-2 -left-2 sm:-top-3 -left-3 w-8 h-8 sm:w-10 sm:h-10 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer rounded-full border-2 sm:border-4 border-white flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Decorative Floating Elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#395c80]/5 rounded-full blur-2xl -z-0"></div>
          <div className="absolute top-1/2 -left-12 w-24 h-[2px] bg-gradient-to-r from-transparent to-[#395c80]/20 -z-0"></div>
        </div>

      </div>
    </section>
  );
}
