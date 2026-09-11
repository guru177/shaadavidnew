import React from "react";
import type { ProductSpecRow } from "@/types/product";

type Props = {
  bookDetails: ProductSpecRow[];
  dimensions: ProductSpecRow[];
};

export default function ProductSpecifications({ bookDetails, dimensions }: Props) {
  return (
    <div className="font-malayalam">
      <h2 className="text-2xl md:text-3xl font-light text-[#0c1622] mb-10 relative inline-block">
        സവിശേഷതകൾ
        <span className="absolute -bottom-3 left-0 w-12 h-1 bg-[#395c80] rounded-full"></span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
          <h3 className="text-[19px] font-medium text-[#0c1622] mb-8 flex items-center gap-3">
            <span className="bg-gray-50 p-2.5 rounded-xl text-[#395c80]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            പുസ്തകത്തിന്റെ വിവരങ്ങൾ
          </h3>
          <div className="space-y-5">
            {bookDetails.map((row, idx) => (
              <div
                key={row.label}
                className={`flex w-full items-start justify-between gap-3 sm:gap-4 ${idx < bookDetails.length - 1 ? "border-b border-gray-50 pb-4" : ""}`}
              >
                <span className="shrink-0 text-gray-500 text-[15px]">{row.label}</span>
                <span className="min-w-0 flex-1 text-right text-[#0c1622] font-medium text-[15px] leading-snug">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
          <h3 className="text-[19px] font-medium text-[#0c1622] mb-8 flex items-center gap-3">
            <span className="bg-gray-50 p-2.5 rounded-lg text-[#395c80]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </span>
            അളവുകൾ
          </h3>
          <div className="space-y-5">
            {dimensions.map((row, idx) => (
              <div
                key={row.label}
                className={`flex w-full items-start justify-between gap-3 sm:gap-4 ${idx < dimensions.length - 1 ? "border-b border-gray-50 pb-4" : ""}`}
              >
                <span className="shrink-0 text-gray-500 text-[15px]">{row.label}</span>
                <span className="min-w-0 flex-1 text-right text-[#0c1622] font-medium text-[15px] leading-snug">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
