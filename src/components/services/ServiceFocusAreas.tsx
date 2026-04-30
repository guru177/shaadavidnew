import React from 'react';

export default function ServiceFocusAreas() {
  const focusAreas = [
    { title: "പരീക്ഷാ ഭയം", description: "Exam Fear", icon: "academic" },
    { title: "ശ്രദ്ധയുടെ കുറവ്", description: "Lack of Attention", icon: "focus" },
    { title: "ആത്മവിശ്വാസഹീനത", description: "Lack of Confidence", icon: "confidence" },
    { title: "കരിയർ സംശയം", description: "Career Confusion", icon: "career" },
    { title: "വികാരപരമായ പൊട്ടിത്തെറിയുകൾ", description: "Emotional Outbursts", icon: "emotion" },
    { title: "മാനസിക സമ്മർദ്ദം", description: "Parental Stress", icon: "stress" }
  ];

  return (
    <section className="relative w-full py-[100px] xl:py-[140px] px-5 md:px-8 xl:px-12 2xl:px-16 bg-gray-50/50 overflow-hidden">

      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#395c80]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="flex flex-col items-center text-center mb-10 sm:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] md:text-xs font-black text-white mb-6 shadow-md bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer font-malayalam uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          പ്രധാന മേഖലകൾ
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-malayalam font-extrabold text-[#0c1622] leading-[1.4] px-4">
          ഞങ്ങൾ കൈകാര്യം ചെയ്യുന്ന <span className="sm:block text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer">പ്രധാന വിഷയങ്ങൾ</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 relative z-10">
        {focusAreas.map((area, idx) => (
          <div key={idx} className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_32px_64px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer flex items-center justify-center mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-2xl font-malayalam font-extrabold text-[#0c1622] mb-3 sm:mb-4 group-hover:text-[#395c80] transition-colors leading-snug">
              {area.title}
            </h3>
            <p className="text-gray-400 font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase">
              {area.description}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Direct Section */}
      <div className="mt-16 sm:mt-24 max-w-9xl mx-auto p-8 sm:p-16 lg:p-20 rounded-[40px] sm:rounded-[50px] bg-[#0c1622] relative overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer opacity-40" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
          <div className="text-center lg:text-left max-w-2xl">
            <h3 className="text-2xl sm:text-4xl xl:text-5xl font-malayalam font-extrabold text-white mb-4 sm:mb-6 leading-[1.4]">
              കൂടുതൽ വിവരങ്ങൾക്ക് വിളിക്കൂ
            </h3>
            <p className="text-blue-100/70 font-malayalam text-lg sm:text-2xl">
              വിദഗ്ദ്ധമായ മാർഗ്ഗനിർദ്ദേശം ഇന്നുതന്നെ ഉറപ്പാക്കൂ.
            </p>
          </div>
          <div className="shrink-0 w-full sm:w-auto">
            <a href="tel:+918891337811" className="inline-flex items-center justify-center gap-4 w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-white text-[#0c1622] rounded-full font-black text-lg sm:text-2xl shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 88913 37811
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
