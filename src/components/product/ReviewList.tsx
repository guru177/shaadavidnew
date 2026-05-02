"use client";

import React, { useState } from 'react';

const REVIEWS_DATA = [
  {
    name: "Rahul Menon",
    title: "Game changer for spoken English!",
    date: "Reviewed in India on October 12, 2025",
    content: "I have bought many grammar books before, but this one is completely different. The way Shaa David explains complex rules directly by connecting them to Malayalam sentence structures makes it incredibly easy to grasp. The print quality is also excellent.",
    rating: 5,
    helpful: 124
  },
  {
    name: "Anjali K.",
    title: "Very practical and easy to follow",
    date: "Reviewed in India on September 28, 2025",
    content: "This companion is exactly what I needed. It doesn't bore you with endless rules; instead, it focuses on conversational English. The examples are things we actually use in our daily lives in Kerala. Highly recommend!",
    rating: 5,
    helpful: 89
  },
  {
    name: "Thomas Varghese",
    title: "Good structure, but could use an audio CD",
    date: "Reviewed in India on August 15, 2025",
    content: "The content is solid 5/5. My only feedback is that it would have been great if it came with an audio companion or QR codes to hear the pronunciation. Otherwise, the best book in the market for Malayalis.",
    rating: 4,
    helpful: 45
  },
  {
    name: "Sneha Nair",
    title: "Best investment for my career",
    date: "Reviewed in India on August 2, 2025",
    content: "I always struggled with framing sentences during interviews. This book gave me the confidence to translate my thoughts from Malayalam to English without awkward pauses.",
    rating: 5,
    helpful: 112
  },
  {
    name: "Arun Kumar",
    title: "Helpful for IELTS preparation",
    date: "Reviewed in India on July 19, 2025",
    content: "While it's meant for spoken English, I found it very helpful for getting my basic grammar straight before starting my formal IELTS coaching. The physical quality of the book is premium.",
    rating: 5,
    helpful: 67
  },
  {
    name: "Biju P.",
    title: "Clear and concise",
    date: "Reviewed in India on June 30, 2025",
    content: "No fluff, straight to the point. Every chapter is well laid out. I particularly liked the section on common errors Malayalis make while speaking English.",
    rating: 4,
    helpful: 34
  },
  {
    name: "Meera Das",
    title: "Bought it for my mother",
    date: "Reviewed in India on June 15, 2025",
    content: "My mother always wanted to learn English but found traditional books intimidating. She loves this book because it speaks to her in Malayalam first.",
    rating: 5,
    helpful: 230
  },
  {
    name: "Vishnu S.",
    title: "A must-have companion",
    date: "Reviewed in India on May 22, 2025",
    content: "I carry it in my bag everywhere. The everyday conversation phrases are extremely useful for my sales job.",
    rating: 5,
    helpful: 88
  },
  {
    name: "Kavya Pillai",
    title: "Very relatable examples",
    date: "Reviewed in India on May 10, 2025",
    content: "The examples are so localized and relatable. You won't find sentences like 'John went to the bakery to buy bagels'. Instead, you get real conversations you'd hear in Kerala.",
    rating: 5,
    helpful: 156
  },
  {
    name: "Jacob T.",
    title: "Great book, slow delivery",
    date: "Reviewed in India on April 28, 2025",
    content: "The book is fantastic, no complaints about the content. However, the delivery took over a week to reach my hometown in Pathanamthitta.",
    rating: 4,
    helpful: 12
  }
];

export default function ReviewList() {
  const [visibleCount, setVisibleCount] = useState(3);

  const loadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const visibleReviews = REVIEWS_DATA.slice(0, visibleCount);

  return (
    <div className="lg:col-span-8 flex flex-col gap-10">
      
      {/* Review Items */}
      {visibleReviews.map((review, idx) => (
        <div key={idx} className={idx !== 0 ? "pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500" : "animate-in fade-in slide-in-from-bottom-4 duration-500"}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <span className="font-medium text-[#0c1622] text-[16px]">{review.name}</span>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 fill-current ${i < review.rating ? '' : 'text-gray-200'}`} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ))}
            </div>
            <span className="font-bold text-[#0c1622] text-[15px]">{review.title}</span>
          </div>
          
          <div className="text-gray-500 text-[14px] mb-2">{review.date}</div>
          
          <div className="text-[#c45500] text-[13px] font-bold mb-4 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            സ്ഥിരീകരിച്ച വാങ്ങൽ
          </div>
          
          <p className="text-[#0c1622] text-[16px] leading-[1.8] mb-5">
            {review.content}
          </p>
          
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 border border-gray-300 rounded-full text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              ഉപകാരപ്രദം
            </button>
            <span className="text-gray-500 text-[14px] border-l border-gray-300 pl-4 cursor-pointer hover:underline">ദുരുപയോഗം റിപ്പോർട്ട് ചെയ്യുക</span>
          </div>
        </div>
      ))}

      <div className="pt-6 flex gap-6">
        {visibleCount < REVIEWS_DATA.length && (
          <button 
            onClick={loadMore}
            className="text-[15px] font-medium text-[#395c80] hover:text-[#29425e] flex items-center gap-2 hover:underline transition-colors"
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
            className="text-[15px] font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2 hover:underline transition-colors"
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
