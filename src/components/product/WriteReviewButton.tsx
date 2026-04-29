"use client";

import React, { useState } from 'react';

export default function WriteReviewButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm text-[15px] font-medium text-[#0c1622] hover:bg-gray-50 transition-colors"
      >
        Write a customer review
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            style={{ animation: 'modalFadeIn 0.2s ease-out forwards' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-medium text-[#0c1622]">Write a Review</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <img src="/product.png" alt="Product" className="w-16 h-16 object-contain border border-gray-100 rounded-md bg-gray-50 p-1" />
                <div>
                  <h3 className="font-medium text-[#0c1622]">Shaa David English Companion</h3>
                  <p className="text-sm text-gray-500 mt-0.5">The Ultimate Guide to Spoken English</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={(e) => { 
                e.preventDefault(); 
                setIsOpen(false); 
                alert("Thank you! Your review has been submitted for moderation."); 
              }}>
                <div>
                  <label className="block text-[15px] font-medium text-[#0c1622] mb-3">Overall rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className={`w-9 h-9 cursor-pointer transition-colors ${
                          (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[15px] font-medium text-[#0c1622] mb-2">Add a headline</label>
                  <input 
                    type="text" 
                    placeholder="What's most important to know?" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all placeholder:text-gray-400" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-medium text-[#0c1622] mb-2">Add a written review</label>
                  <textarea 
                    rows={4} 
                    placeholder="What did you like or dislike? What did you use this product for?" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all resize-none placeholder:text-gray-400" 
                    required
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-3.5 bg-[#395c80] hover:bg-[#29425e] text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <style>{`
            @keyframes modalFadeIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
