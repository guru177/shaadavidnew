import React from "react";

export default function ProductMoreInfo() {
  return (
    <div className="mb-16">
      <h2 className="text-2xl md:text-3xl font-light text-[#0c1622] mb-10 relative inline-block">
        കൂടുതൽ വിവരങ്ങൾ
        <span className="absolute -bottom-3 left-0 w-12 h-1 bg-[#395c80] rounded-full"></span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <p className="text-gray-600 leading-[1.9] text-[16px] md:text-[17px]">
            മലയാളത്തിനും ഇംഗ്ലീഷിനും ഇടയിലുള്ള വിടവ് നികത്തുന്നതിനായി <strong className="text-[#0c1622] font-medium">ഷാ ഡേവിഡ് ഇംഗ്ലീഷ് കമ്പാനിയൻ</strong> അതീവ ശ്രദ്ധയോടെ തയ്യാറാക്കിയതാണ്. പരമ്പരാഗത വ്യാകരണ പുസ്തകങ്ങളിൽ നിന്ന് വ്യത്യസ്തമായി, സങ്കീർണ്ണമായ നിയമങ്ങളിൽ കുടുങ്ങാതെ നിങ്ങളുടെ ചിന്തകളെ തടസ്സമില്ലാതെ വിവർത്തനം ചെയ്യാൻ സഹായിക്കുന്ന പ്രായോഗിക പ്രയോഗത്തിലാണ് ഈ പുസ്തകം ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നത്.
          </p>
        </div>
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <h3 className="text-[19px] font-medium text-[#0c1622] mb-6">പ്രധാന സവിശേഷതകൾ</h3>
          <ul className="space-y-4">
            {[
              "500-ലധികം പ്രായോഗിക ദൈനംദിന സംഭാഷണ ശൈലികൾ.",
              "നേരിട്ട് ഇംഗ്ലീഷിൽ ചിന്തിക്കുന്നതിനുള്ള പ്രത്യേക വിദ്യകൾ.",
              "മലയാളികളുടെ വാക്യഘടന പ്രത്യേകമായി മനസ്സിൽ വെച്ചുകൊണ്ട് രൂപകൽപ്പന ചെയ്തത്.",
              "ദൈനംദിന ഉപയോഗത്തിനായി ഉയർന്ന നിലവാരമുള്ള പ്രിന്റും മോടിയുള്ള ബൈൻഡിംഗും."
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
