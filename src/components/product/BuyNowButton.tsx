"use client";

import React, { useState } from 'react';

export default function BuyNowButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Form states
  const [address, setAddress] = useState({
    name: '', mobile: '', pincode: '', flat: '', area: '', city: '', state: ''
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');
    
    if (step === 3) {
      if (!screenshot) {
        setOrderError('ദയവായി സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്യുക (Please upload screenshot)');
        return;
      }
      
      setIsSubmitting(true);
      try {
        // 1. Upload screenshot
        const formData = new FormData();
        formData.append('file', screenshot);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload screenshot');
        const uploadData = await uploadRes.json();
        
        // 2. Submit order
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            screenshotUrl: uploadData.url
          })
        });
        
        if (!orderRes.ok) throw new Error('Failed to create order');
        
        // Success
        setStep(4);
      } catch (err: any) {
        setOrderError('ഓർഡർ സമർപ്പിക്കുന്നതിൽ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.');
      } finally {
        setIsSubmitting(false);
      }
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setScreenshot(null);
      setAddress({ name: '', mobile: '', pincode: '', flat: '', area: '', city: '', state: '' });
      setOrderError('');
    }, 300); // Reset after animation
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
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
              {['വിലാസം', 'പേയ്‌മെന്റ്', 'പരിശോധന', 'പൂർത്തിയായി'].map((lbl, idx) => {
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

              {/* Step 2: Payment QR */}
              {step === 2 && (
                <form id="checkout-form" onSubmit={handleNext} className="space-y-6 flex flex-col items-center py-4">
                  <h3 className="text-lg font-medium text-[#0c1622] w-full text-center">ക്യുആർ കോഡ് സ്കാൻ ചെയ്ത് പണമടയ്ക്കുക</h3>
                  <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm inline-block transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=dummy@upi%26pn=Shaa+David%26am=499.00%26cu=INR" 
                      alt="Payment QR Code" 
                      className="w-[200px] h-[200px] mx-auto border border-gray-100 p-2 rounded-xl"
                    />
                    <div className="text-center mt-6 font-bold text-2xl text-[#395c80]">₹499.00</div>
                  </div>
                  <p className="text-sm text-gray-500 text-center max-w-sm mt-2 leading-relaxed">
                    നിങ്ങളുടെ ഇഷ്ടമുള്ള യുപിഐ ആപ്പ് (GPay, PhonePe, Paytm) ഉപയോഗിച്ച് ഈ കോഡ് സ്കാൻ ചെയ്യുക.
                  </p>
                </form>
              )}

              {/* Step 3: Attach Screenshot */}
              {step === 3 && (
                <form id="checkout-form" onSubmit={handleNext} className="space-y-6 flex flex-col items-center py-4">
                  <h3 className="text-lg font-medium text-[#0c1622] w-full text-center">പേയ്‌മെന്റ് സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്യുക</h3>
                  <p className="text-sm text-gray-500 text-center max-w-md leading-relaxed">
                    പണമടച്ചതിന് ശേഷം, വിജയകരമായ പേയ്‌മെന്റിന്റെ സ്ക്രീൻഷോട്ട് ഇവിടെ അപ്‌ലോഡ് ചെയ്യുക.
                  </p>
                  
                  <div className="w-full max-w-md mt-4">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#395c80]/30 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-gray-50 transition-colors relative overflow-hidden group shadow-sm">
                      {screenshot ? (
                        <div className="absolute inset-0 p-3">
                          <img src={URL.createObjectURL(screenshot)} alt="Screenshot preview" className="w-full h-full object-contain rounded-xl bg-gray-50" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                            <span className="text-white font-medium px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">മാറ്റുക (Change)</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="w-16 h-16 mb-4 rounded-full bg-[#395c80]/10 flex items-center justify-center text-[#395c80] group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                          <p className="mb-2 text-sm text-[#0c1622] font-semibold">സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക</p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" required={step===3} onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setScreenshot(e.target.files[0]);
                          setOrderError('');
                        }
                      }} />
                    </label>
                  </div>
                  {orderError && <p className="text-red-500 text-sm font-semibold mt-2 text-center">{orderError}</p>}
                </form>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="text-center py-10 flex flex-col items-center justify-center">
                  
                  {/* Animated Checkmark Icon */}
                  <div className="relative mb-6">
                    {/* Pulsing background rings */}
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-500"></div>
                    
                    {/* Main circle */}
                    <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-green-500 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(52,211,153,0.4)] z-10 animate-[scaleIn_0.5s_ease-out_forwards]">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none">
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

                  <h3 className="text-2xl font-bold text-[#0c1622] mb-3 opacity-0 animate-[fadeUp_0.5s_ease-out_0.4s_forwards]">
                    ഓർഡർ സമർപ്പിച്ചു!
                  </h3>
                  
                  <p className="text-gray-500 text-[15px] max-w-sm mx-auto mb-8 leading-relaxed opacity-0 animate-[fadeUp_0.5s_ease-out_0.6s_forwards]">
                    നന്ദി, <strong className="text-[#0c1622]">{address.name}</strong>. നിങ്ങളുടെ പേയ്‌മെന്റ് ഞങ്ങൾ പരിശോധിച്ചുകൊണ്ടിരിക്കുകയാണ്. ഷാ ഡേവിഡ് ഇംഗ്ലീഷ് കമ്പാനിയൻ ഉടൻ എത്തും.
                  </p>
                  
                  <div className="w-full max-w-sm mx-auto opacity-0 animate-[fadeUp_0.5s_ease-out_0.8s_forwards] relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#29425e] to-[#395c80] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white border border-gray-100/50 rounded-2xl p-5 text-left shadow-xl shadow-gray-200/40 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">ഓർഡർ സ്റ്റാറ്റസ്</div>
                          <div className="text-sm font-bold text-amber-600">പരിശോധിക്കുന്നു (Verifying)</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-4">
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
                            <svg className="w-4 h-4 text-[#395c80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg> 
                            ക്യുആർ കോഡ് (QR Payment)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            {step < 4 && (
              <div className="border-t border-gray-100 p-4 sm:p-5 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-base sm:text-[17px] font-bold text-[#0c1622] w-full sm:w-auto text-center sm:text-left">
                  ആകെ: <span className="text-[#395c80] ml-1">₹499.00</span>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap">
                      പുറകിലേക്ക്
                    </button>
                  )}
                  <button disabled={isSubmitting} type="submit" form="checkout-form" className="flex-[2] sm:flex-none px-4 sm:px-8 py-2.5 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] hover:shadow-lg text-white rounded-xl font-medium shadow-sm transition-all text-sm sm:text-base whitespace-nowrap disabled:opacity-70">
                    {isSubmitting ? 'Processing...' : (step === 1 ? 'അയക്കുക' : step === 2 ? 'തുടരുക' : 'ഓർഡർ നൽകുക')}
                  </button>
                </div>
              </div>
            )}
            
            {step === 4 && (
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
