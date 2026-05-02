"use client";

import React, { useState } from 'react';

export default function BuyNowButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Form states
  const [address, setAddress] = useState({
    name: '', mobile: '', pincode: '', flat: '', area: '', city: '', state: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setStep(1), 300); // Reset after animation
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        suppressHydrationWarning
        className="flex-1 py-4 w-full bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] text-white rounded-2xl font-bold text-[14px] md:text-[16px] uppercase flex items-center justify-center gap-2 hover:shadow-lg transition-shadow shadow-sm font-malayalam"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0-3l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1v2h2l3.6 7.59zm3.5-3v-3h-3l4-4 4 4h-3v3h-2z"/></svg>
        ഇപ്പോൾ വാങ്ങുക
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] font-malayalam"
            style={{ animation: 'modalFadeIn 0.2s ease-out forwards' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)]">
              <h2 className="text-xl font-medium text-white">സുരക്ഷിതമായ ചെക്ക്ഔട്ട്</h2>
              <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Stepper Header */}
            <div className="flex border-b border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 relative">
              {['വിലാസം', 'പേയ്‌മെന്റ്', 'സ്ഥിരീകരിക്കുക'].map((lbl, idx) => {
                const s = idx + 1;
                const isActive = step === s;
                const isPast = step > s;
                return (
                  <div key={lbl} className={`flex-1 text-center py-3.5 text-sm font-medium border-b-[3px] transition-all duration-300 ${isActive ? 'border-[#395c80] text-[#395c80]' : isPast ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400'}`}>
                    {lbl}
                  </div>
                );
              })}
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              
              {/* Step 1: Address Form */}
              {step === 1 && (
                <form id="checkout-form" onSubmit={handleNext} className="space-y-4">
                  <h3 className="text-lg font-medium text-[#0c1622] mb-4">ഡെലിവറി വിലാസം ചേർക്കുക</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">പൂർണ്ണനാമം</label>
                      <input type="text" required value={address.name} onChange={e=>setAddress({...address, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">മൊബൈൽ നമ്പർ</label>
                      <input type="tel" required value={address.mobile} onChange={e=>setAddress({...address, mobile: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">പിൻ കോഡ്</label>
                      <input type="text" required value={address.pincode} onChange={e=>setAddress({...address, pincode: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ഫ്ലാറ്റ്, വീട്ടു നമ്പർ, കെട്ടിടം</label>
                      <input type="text" required value={address.flat} onChange={e=>setAddress({...address, flat: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">സ്ഥലം, തെരുവ്, വില്ലേജ്</label>
                    <textarea required rows={3} value={address.area} onChange={e=>setAddress({...address, area: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm resize-none"></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">നഗരം</label>
                      <input type="text" required value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">സംസ്ഥാനം</label>
                      <input type="text" required value={address.state} onChange={e=>setAddress({...address, state: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm" />
                    </div>
                  </div>
                </form>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <form id="checkout-form" onSubmit={handleNext} className="space-y-6">
                  <h3 className="text-lg font-medium text-[#0c1622]">പേയ്‌മെന്റ് രീതി തിരഞ്ഞെടുക്കുക</h3>
                  
                  <div className="space-y-3">
                    <label className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all bg-white shadow-sm ${paymentMethod === 'cod' ? 'border-[#395c80] ring-1 ring-[#395c80]/20' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1 w-4 h-4 text-[#395c80] focus:ring-[#395c80]" />
                      <div>
                        <div className="font-medium text-[#0c1622]">ക്യാഷ് ഓൺ ഡെലിവറി (ക്യാഷ്/യുപിഐ)</div>
                        <div className="text-sm text-gray-500 mt-1">വാതിൽക്കൽ പണമടയ്ക്കുക.</div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all bg-white shadow-sm ${paymentMethod === 'upi' ? 'border-[#395c80] ring-1 ring-[#395c80]/20' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mt-1 w-4 h-4 text-[#395c80] focus:ring-[#395c80]" />
                      <div className="w-full">
                        <div className="font-medium text-[#0c1622] flex items-center gap-2">
                          യുപിഐ ആപ്പുകൾ
                          <span className="flex gap-1">
                            <span className="bg-gray-50 border border-gray-200 rounded px-1.5 text-[10px] font-bold text-gray-600 tracking-wide uppercase">GPay</span>
                            <span className="bg-gray-50 border border-gray-200 rounded px-1.5 text-[10px] font-bold text-gray-600 tracking-wide uppercase">PhonePe</span>
                          </span>
                        </div>
                        {paymentMethod === 'upi' && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                             <input type="text" placeholder="യുപിഐ ഐഡി നൽകുക (ഉദാ: name@okhdfcbank)" className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-gray-50 text-sm" />
                          </div>
                        )}
                      </div>
                    </label>

                    <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all bg-white shadow-sm ${paymentMethod === 'card' ? 'border-[#395c80] ring-1 ring-[#395c80]/20' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mt-1 w-4 h-4 text-[#395c80] focus:ring-[#395c80]" />
                      <div className="w-full">
                        <div className="font-medium text-[#0c1622]">ക്രെഡിറ്റ് അല്ലെങ്കിൽ ഡെബിറ്റ് കാർഡ്</div>
                        {paymentMethod === 'card' && (
                          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                            <input type="text" placeholder="കാർഡ് നമ്പർ" className="col-span-2 w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-gray-50 text-sm" />
                            <input type="text" placeholder="മാസം/വർഷം" className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-gray-50 text-sm" />
                            <input type="text" placeholder="സിവിവി (CVV)" className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-gray-50 text-sm" />
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </form>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  
                  {/* Animated Checkmark Icon */}
                  <div className="relative mb-8">
                    {/* Pulsing background rings */}
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-500"></div>
                    
                    {/* Main circle */}
                    <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-green-500 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(52,211,153,0.4)] z-10 animate-[scaleIn_0.5s_ease-out_forwards]">
                      <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none">
                        <path 
                          className="animate-[drawCheck_0.5s_ease-out_0.3s_forwards]" 
                          style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
                          stroke="currentColor" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-3xl font-light text-[#0c1622] mb-3 opacity-0 animate-[fadeUp_0.5s_ease-out_0.4s_forwards]">
                    ഓർഡർ സ്ഥിരീകരിച്ചു!
                  </h3>
                  
                  <p className="text-gray-500 text-[16px] max-w-md mx-auto mb-10 leading-relaxed opacity-0 animate-[fadeUp_0.5s_ease-out_0.4s_forwards]">
                    നന്ദി, <strong className="text-[#0c1622] font-medium">{address.name}</strong>. നിങ്ങളുടെ <strong className="text-[#395c80] font-medium">ഷാ ഡേവിഡ് ഇംഗ്ലീഷ് കമ്പാനിയൻ</strong> ഉടൻ എത്തും. ഞങ്ങൾ നിങ്ങൾക്ക് ഒരു സ്ഥിരീകരണ ഇമെയിൽ അയച്ചിട്ടുണ്ട്.
                  </p>
                  
                  <div className="w-full max-w-sm mx-auto opacity-0 animate-[fadeUp_0.5s_ease-out_0.6s_forwards] relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#29425e] to-[#395c80] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white border border-gray-100/50 rounded-2xl p-6 text-left shadow-xl shadow-gray-200/40 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 rounded-full bg-[#395c80]/10 flex items-center justify-center text-[#395c80]">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">ഓർഡർ സ്റ്റാറ്റസ്</div>
                          <div className="text-sm font-bold text-emerald-600">പ്രോസസ്സിംഗ്</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                        <div className="col-span-2">
                          <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">ഷിപ്പിംഗ് വിലാസം</div>
                          <div className="font-medium text-[#0c1622] text-[14px] leading-tight">
                            {address.name}<br/>
                            <span className="text-gray-500 font-normal mt-0.5 inline-block">
                              {address.flat}, {address.area}<br/>
                              {address.city}, {address.state} {address.pincode}
                            </span>
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">പേയ്‌മെന്റ് രീതി</div>
                          <div className="font-medium text-[#0c1622] text-[14px] flex items-center gap-2">
                            {paymentMethod === 'cod' ? (
                              <><svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> ക്യാഷ് ഓൺ ഡെലിവറി</>
                            ) : paymentMethod === 'upi' ? (
                              <><svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> യുപിഐ പേയ്‌മെന്റ്</>
                            ) : (
                              <><svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> കാർഡ് പേയ്‌മെന്റ്</>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            {step < 3 && (
              <div className="border-t border-gray-100 p-5 bg-white flex justify-between items-center gap-4">
                <div className="text-[17px] font-bold text-[#0c1622]">
                  ആകെ: <span className="text-[#395c80] ml-1">₹499.00</span>
                </div>
                <div className="flex gap-3">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                      പുറകിലേക്ക്
                    </button>
                  )}
                  <button type="submit" form="checkout-form" className="px-8 py-2.5 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] hover:shadow-lg text-white rounded-xl font-medium shadow-sm transition-all">
                    {step === 1 ? 'ഈ വിലാസത്തിലേക്ക് അയക്കുക' : 'ഓർഡർ നൽകുക'}
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="border-t border-gray-100 p-5 bg-white flex justify-center">
                <button onClick={handleClose} className="px-8 py-2.5 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] hover:shadow-lg text-white rounded-xl font-medium shadow-sm transition-all">
                  ഷോപ്പിംഗ് തുടരുക
                </button>
              </div>
            )}
          </div>
          
          <style>{`
            @keyframes modalFadeIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes scaleIn {
              from { transform: scale(0); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes drawCheck {
              to { stroke-dashoffset: 0; }
            }
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animation-delay-500 {
              animation-delay: 500ms;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
