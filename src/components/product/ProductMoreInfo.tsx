import React from "react";

export default function ProductMoreInfo() {
  return (
    <div className="mb-16">
      <h2 className="text-2xl md:text-3xl font-light text-[#0c1622] mb-10 relative inline-block">
        More Information
        <span className="absolute -bottom-3 left-0 w-12 h-1 bg-[#395c80]"></span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <p className="text-gray-600 leading-[1.9] text-[16px] md:text-[17px]">
            The <strong className="text-[#0c1622] font-medium">Shaa David English Companion</strong> is meticulously crafted to bridge the gap between Malayalam and English. Unlike traditional grammar books, this companion focuses on practical application, helping you translate your thoughts seamlessly without getting bogged down by complex rules.
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
          <h3 className="text-[19px] font-medium text-[#0c1622] mb-6">Key Features</h3>
          <ul className="space-y-4">
            {[
              "Over 500+ practical everyday conversational phrases.",
              "Exclusive techniques for thinking directly in English.",
              "Designed specifically keeping the Malayali sentence structure in mind.",
              "High-quality print and durable binding for daily use."
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-4 text-gray-600 text-[15px] leading-relaxed">
                <div className="mt-1 bg-white p-1 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#395c80]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
