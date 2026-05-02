import React from "react";
import WriteReviewButton from "./WriteReviewButton";
import ReviewList from "./ReviewList";

export default function ProductReviewsSection() {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-light text-[#0c1622] mb-10 relative inline-block">
        ഉപഭോക്തൃ അവലോകനങ്ങൾ
        <span className="absolute -bottom-3 left-0 w-12 h-1 bg-[#395c80] rounded-full"></span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Rating Summary */}
        <div className="lg:col-span-4 flex flex-col">
          {/* Average Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl font-light text-[#0c1622]">4.8</div>
            <div className="flex flex-col">
              <div className="flex text-yellow-400 mb-1">
                {[1,2,3,4].map((star) => (
                  <svg key={star} className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
                <svg className="w-6 h-6 fill-current text-yellow-400" viewBox="0 0 24 24">
                  <defs><linearGradient id="half"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="#e5e7eb" stopOpacity="1" /></linearGradient></defs>
                  <path fill="url(#half)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <span className="text-gray-500 text-[15px]">1,245 റേറ്റിംഗുകളെ അടിസ്ഥാനമാക്കി</span>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-3">
            {[
              { star: 5, pct: 85 },
              { star: 4, pct: 10 },
              { star: 3, pct: 3 },
              { star: 2, pct: 1 },
              { star: 1, pct: 1 },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-4 text-[15px] group cursor-pointer">
                <span className="text-[#395c80] group-hover:underline w-14 whitespace-nowrap">{row.star} സ്റ്റാർ</span>
                <div className="flex-1 h-[18px] bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div className="h-full bg-[#f59e0b] shadow-sm transition-all duration-500 rounded-full" style={{ width: `${row.pct}%` }}></div>
                </div>
                <span className="text-gray-500 w-10 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-[18px] font-medium text-[#0c1622] mb-2">ഈ ഉൽപ്പന്നത്തെക്കുറിച്ച് റിവ്യൂ എഴുതുക</h3>
            <p className="text-gray-500 text-[15px] mb-6">മറ്റ് ഉപഭോക്താക്കളുമായി നിങ്ങളുടെ അഭിപ്രായങ്ങൾ പങ്കിടുക</p>
            <WriteReviewButton />
          </div>
        </div>

        {/* Right Column: Review List */}
        <ReviewList />
      </div>
    </div>
  );
}
