"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";

import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <Header />

      {/* Hero Section */}
      <div className="w-full min-h-[60vh] lg:min-h-[70vh] relative overflow-hidden flex items-center justify-center text-center px-4 py-24 lg:py-32">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/about.jpg"
            alt="Contact Background"
            fill
            className="object-cover opacity-40 grayscale-[20%]"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1622] via-[#0c1622]/90 to-[#1a2c42]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent"></div>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#395c80] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse z-0"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 z-0"></div>

        <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tighter font-malayalam">ബന്ധപ്പെ<span className="italic">ടാം</span></h1>
          <p className="text-white/70 text-xl md:text-xl max-w-3xl mx-auto leading-relaxed font-light font-malayalam pb-12">
            ഞങ്ങളുടെ ഇംഗ്ലീഷ് കോഴ്‌സുകളെക്കുറിച്ച് സംശയങ്ങളുണ്ടോ അതോ സഹായം ആവശ്യമുണ്ടോ? നിങ്ങളുടെ പഠനയാത്രയിൽ സഹായിക്കാൻ ഞങ്ങളുടെ ടീം സന്നദ്ധരാണ്.
          </p>
        </div>
      </div>

      <div className="w-full px-5 md:px-12 xl:px-20 2xl:px-32 -mt-32 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

          {/* Contact Information Cards */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Quick Contact Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 flex flex-col gap-8">
              <h2 className="text-2xl font-semibold text-[#0c1622] font-malayalam">കോൺടാക്റ്റ് വിവരങ്ങൾ</h2>

              <div className="flex flex-col gap-6">
                {/* Phone */}
                <div className="flex gap-5 items-start group">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#395c80] shrink-0 group-hover:bg-[#395c80] group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-malayalam">വിളിക്കൂ</p>
                    <p className="text-[#0c1622] font-medium">+91 79070 75923</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-5 items-start group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-malayalam">ഇമെയിൽ</p>
                    <p className="text-[#0c1622] font-medium">hello@shaadavid.com</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-5 items-start group">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-malayalam">ഞങ്ങളുടെ ഓഫീസ്</p>
                    <p className="text-[#0c1622] font-medium font-malayalam">MG റോഡ്, എറണാകുളം, കൊച്ചി<br />കേരളം, ഇന്ത്യ - 682011</p>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100"></div>

              <div>
                <p className="text-sm text-gray-500 mb-4 font-malayalam">ഞങ്ങളെ പിന്തുടരൂ:</p>
                <div className="flex gap-3">
                  {['instagram', 'facebook', 'youtube', 'linkedin'].map((social) => (
                    <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#0c1622] hover:text-white transition-all duration-300">
                      <span className="sr-only">{social}</span>
                      <div className="w-5 h-5 capitalize flex items-center justify-center text-[10px] font-bold">{social[0]}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-125"></div>
              <h3 className="text-xl font-semibold mb-2 relative z-10 font-malayalam text-lg">വാട്സാപ്പിലൂടെ ബന്ധപ്പെടാം</h3>
              <p className="text-white/80 text-sm mb-6 relative z-10 font-malayalam">നിങ്ങളുടെ സംശയങ്ങൾക്ക് വാട്സാപ്പിലൂടെ വേഗത്തിൽ മറുപടി ലഭിക്കും.</p>
              <a
                href="https://wa.me/917907075923"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all duration-300 shadow-lg shadow-emerald-900/20 font-malayalam"
              >
                വാട്സാപ്പിൽ ബന്ധപ്പെടാം
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 md:p-12 h-full">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-3xl font-semibold text-[#0c1622] mb-4 font-malayalam">സന്ദേശം അയച്ചു!</h2>
                  <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-malayalam">
                    ഞങ്ങളെ ബന്ധപ്പെട്ടതിന് നന്ദി. നിങ്ങളുടെ സന്ദേശം ലഭിച്ചു, ഉടൻ തന്നെ മറുപടി നൽകുന്നതാണ്.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#395c80] font-bold hover:underline font-malayalam"
                  >
                    മറ്റൊരു സന്ദേശം അയക്കാം
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-3xl font-light text-[#0c1622] mb-3 tracking-tight font-malayalam">ഞങ്ങൾക്ക് <span className="font-semibold italic">സന്ദേശമയക്കാം</span></h2>
                    <p className="text-gray-500 font-malayalam">താഴെ കാണുന്ന ഫോം പൂരിപ്പിക്കുക, ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടുന്നതാണ്.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-500 mb-2 transition-colors group-focus-within:text-[#395c80] font-malayalam">പേര്</label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-[#395c80] focus:ring-4 focus:ring-[#395c80]/5 transition-all bg-white/50 text-[#0c1622] font-medium"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-500 mb-2 transition-colors group-focus-within:text-[#395c80] font-malayalam">ഇമെയിൽ</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-[#395c80] focus:ring-4 focus:ring-[#395c80]/5 transition-all bg-white/50 text-[#0c1622] font-medium"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-500 mb-2 transition-colors group-focus-within:text-[#395c80] font-malayalam">വിഷയം</label>
                      <input
                        required
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-[#395c80] focus:ring-4 focus:ring-[#395c80]/5 transition-all bg-white/50 text-[#0c1622] font-medium"
                        placeholder="വിഷയം രേഖപ്പെടുത്തുക"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-500 mb-2 transition-colors group-focus-within:text-[#395c80] font-malayalam">നിങ്ങളുടെ സന്ദേശം</label>
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-[#395c80] focus:ring-4 focus:ring-[#395c80]/5 transition-all bg-white/50 text-[#0c1622] font-medium resize-none"
                        placeholder="സന്ദേശം ഇവിടെ ടൈപ്പ് ചെയ്യുക..."
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full md:w-auto bg-gradient-to-r from-[#29425e] to-[#395c80] text-white px-12 py-4 rounded-2xl font-bold transition-all duration-300 shadow-[0_12px_24px_rgba(41,66,94,0.25)] hover:shadow-[0_12px_30px_rgba(41,66,94,0.35)] hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center gap-3 font-malayalam`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            അയക്കുന്നു...
                          </>
                        ) : (
                          <>
                            സന്ദേശം അയക്കാം
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
