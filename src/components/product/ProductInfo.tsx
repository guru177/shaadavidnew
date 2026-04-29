import React from "react";
import BuyNowButton from "./BuyNowButton";

export default function ProductInfo() {
  return (
    <>
      {/* Title & Brand */}
      <h1 className="text-xl md:text-[22px] font-medium text-[#0c1622] leading-relaxed mb-2">
        Shaa David's English Companion - The Ultimate Guide to Spoken English for Malayalis (Malayalam & English Edition)
      </h1>

      {/* Ratings */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-[#395c80] text-white px-3 py-1 rounded-full text-sm font-medium">
          4.8
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        </div>
        <span className="text-sm font-medium text-gray-500">
          12,453 Ratings & 1,204 Reviews
        </span>
      </div>

      {/* Price section */}
      <div className="flex flex-col gap-1 mb-8 border-b border-gray-100 pb-8">
        <span className="text-[#395c80] text-[13px] font-bold tracking-wide uppercase">Special price</span>
        <div className="flex items-end gap-3">
          <span className="text-[34px] font-medium text-[#0c1622] leading-none">₹499</span>
          <span className="text-base text-gray-500 line-through mb-[2px]">₹999</span>
          <span className="text-[15px] font-bold text-[#395c80] mb-[2px]">50% off</span>
        </div>
      </div>

      {/* Description */}
      <div className="py-6">
        <h2 className="text-lg font-medium text-[#0c1622] mb-4">Product Description</h2>
        <p className="text-[#0c1622] leading-[1.8] text-[15px]">
          Master English speaking with absolute confidence. The Shaa David English Companion is designed specifically for Malayalis, breaking down complex grammatical rules into easy-to-understand Malayalam concepts. Instead of memorizing rules, you will learn to think and construct sentences naturally. 
          <br/><br/>
          This comprehensive guide includes hundreds of practical conversations, vocabulary builders, and real-life scenarios. Whether you're a student, professional, or someone looking to improve their spoken English, this book is your perfect companion.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-4 mt-8">
          <BuyNowButton />
        </div>
      </div>
    </>
  );
}
