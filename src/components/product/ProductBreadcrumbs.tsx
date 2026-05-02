import React from "react";

export default function ProductBreadcrumbs() {
  return (
    <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-2 flex-wrap">
      <span className="hover:text-[#395c80] cursor-pointer font-medium">ഹോം</span>
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
      <span className="hover:text-[#395c80] cursor-pointer font-medium">പുസ്തകങ്ങളും പഠനസാമഗ്രികളും</span>
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
      <span className="hover:text-[#395c80] cursor-pointer font-medium">ഇംഗ്ലീഷ് പഠനം</span>
    </div>
  );
}
