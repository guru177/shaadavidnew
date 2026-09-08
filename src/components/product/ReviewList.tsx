"use client";

import React, { useState } from "react";
import type { ProductReview } from "@/types/product";

type Props = {
  reviews: ProductReview[];
};

export default function ReviewList({ reviews }: Props) {
  const [visibleCount, setVisibleCount] = useState(3);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const visibleReviews = reviews.slice(0, visibleCount);

  if (!reviews.length) {
    return (
      <div className="lg:col-span-8 flex items-center justify-center text-gray-500 font-malayalam py-16">
        ഇതുവരെ റിവ്യൂകളൊന്നുമില്ല. ആദ്യം റിവ്യൂ എഴുതൂ!
      </div>
    );
  }

  return (
    <div className="lg:col-span-8 flex flex-col gap-10">
      {visibleReviews.map((review, idx) => (
        <div
          key={review.id}
          className={
            idx !== 0
              ? "pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
              : "animate-in fade-in slide-in-from-bottom-4 duration-500"
          }
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="font-medium text-[#0c1622] text-[16px]">{review.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 fill-current ${i < review.rating ? "" : "text-gray-200"}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="font-bold text-[#0c1622] text-[15px]">{review.title}</span>
          </div>

          <div className="text-gray-500 text-[14px] mb-2">{review.date}</div>

          <div className="text-[#c45500] text-[13px] font-bold mb-4 flex items-center gap-1.5 font-malayalam">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            സ്ഥിരീകരിച്ച വാങ്ങൽ
          </div>

          <p className="text-[#0c1622] text-[16px] leading-[1.8] mb-5">{review.content}</p>

          <div className="flex items-center gap-4">
            <button className="px-5 py-2 border border-gray-300 rounded-full text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-malayalam">
              ഉപകാരപ്രദം ({review.helpful})
            </button>
            <span className="text-gray-500 text-[14px] border-l border-gray-300 pl-4 cursor-pointer hover:underline font-malayalam">
              ദുരുപയോഗം റിപ്പോർട്ട് ചെയ്യുക
            </span>
          </div>
        </div>
      ))}

      <div className="pt-6 flex gap-6">
        {visibleCount < reviews.length && (
          <button
            onClick={loadMore}
            className="text-[15px] font-medium text-[#395c80] hover:text-[#29425e] flex items-center gap-2 hover:underline transition-colors font-malayalam"
          >
            കൂടുതൽ റിവ്യൂകൾ കാണുക
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {visibleCount > 3 && (
          <button
            onClick={() => setVisibleCount(3)}
            className="text-[15px] font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2 hover:underline transition-colors font-malayalam"
          >
            കുറച്ച് റിവ്യൂകൾ കാണുക
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
