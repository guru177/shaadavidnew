import React from "react";
import BuyNowButton from "./BuyNowButton";

export default function ProductInfo() {
  return (
    <>
      {/* Title & Brand */}
      <h1 className="text-xl md:text-[22px] font-medium text-[#0c1622] leading-relaxed mb-2 font-malayalam">
        ഷാ ഡേവിഡിന്റെ ഇംഗ്ലീഷ് കമ്പാനിയൻ - മലയാളികൾക്കായി സ്പോക്കൺ ഇംഗ്ലീഷിലേക്കുള്ള ആത്യന്തിക വഴികാട്ടി (മലയാളം & ഇംഗ്ലീഷ് പതിപ്പ്)
      </h1>

      {/* Ratings */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-[#395c80] text-white px-3 py-1 rounded-full text-sm font-medium">
          4.8
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        </div>
        <span className="text-sm font-medium text-gray-500 font-malayalam">
          12,453 റേറ്റിംഗുകളും 1,204 റിവ്യൂകളും
        </span>
      </div>

      {/* Price section */}
      <div className="flex flex-col gap-1 mb-8 border-b border-gray-100 pb-8">
        <span className="text-[#395c80] text-[13px] font-bold tracking-wide uppercase font-malayalam">പ്രത്യേക വില</span>
        <div className="flex items-end gap-3">
          <span className="text-[34px] font-medium text-[#0c1622] leading-none">₹499</span>
          <span className="text-base text-gray-500 line-through mb-[2px]">₹999</span>
          <span className="text-[15px] font-bold text-[#395c80] mb-[2px] font-malayalam">50% കിഴിവ്</span>
        </div>
      </div>

      {/* Description */}
      <div className="py-6">
        <h2 className="text-lg font-medium text-[#0c1622] mb-4 font-malayalam">ഉൽപ്പന്ന വിവരണം</h2>
        <p className="text-[#0c1622] leading-[1.8] text-[15px] font-malayalam">
          പൂർണ്ണ ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് സംസാരിക്കാൻ പഠിക്കൂ. ഷാ ഡേവിഡ് ഇംഗ്ലീഷ് കമ്പാനിയൻ മലയാളികൾക്കായി പ്രത്യേകം രൂപകൽപ്പന ചെയ്തിട്ടുള്ളതാണ്, സങ്കീർണ്ണമായ വ്യാകരണ നിയമങ്ങളെ എളുപ്പത്തിൽ മനസ്സിലാക്കാവുന്ന മലയാളം ആശയങ്ങളിലേക്ക് മാറ്റുന്നു. നിയമങ്ങൾ മനഃപാഠമാക്കുന്നതിന് പകരം, സ്വാഭാവികമായി ചിന്തിക്കാനും വാക്യങ്ങൾ നിർമ്മിക്കാനും നിങ്ങൾ പഠിക്കും. 
          <br/><br/>
          ഈ സമഗ്രമായ ഗൈഡിൽ നൂറുകണക്കിന് പ്രായോഗിക സംഭാഷണങ്ങളും പദസമ്പത്ത് മെച്ചപ്പെടുത്താനുള്ള വഴികളും യഥാർത്ഥ ജീവിത സാഹചര്യങ്ങളും ഉൾപ്പെടുന്നു. നിങ്ങൾ ഒരു വിദ്യാർത്ഥിയോ പ്രൊഫഷണലോ അല്ലെങ്കിൽ നിങ്ങളുടെ സ്പോക്കൺ ഇംഗ്ലീഷ് മെച്ചപ്പെടുത്താൻ ആഗ്രഹിക്കുന്ന ഒരാളോ ആകട്ടെ, ഈ പുസ്തകം നിങ്ങളുടെ മികച്ച കൂട്ടാളിയാണ്.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-4 mt-8">
          <BuyNowButton />
        </div>
      </div>
    </>
  );
}
