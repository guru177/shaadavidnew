"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import {
  buildAddressLines,
  formatPhoneDisplay,
  toTelHref,
  toWhatsAppHref,
} from "@/lib/contactFormat";

const fieldClass =
  "w-full rounded-2xl border border-gray-200 bg-[#FAFBFC] px-4 py-3.5 text-sm text-[#0c1622] outline-none transition-all placeholder:text-gray-400 focus:border-[#395c80] focus:bg-white focus:ring-2 focus:ring-[#395c80]/15";
const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-malayalam";

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  const phoneLabel = formatPhoneDisplay(settings.contact.phone);
  const phoneHref = toTelHref(settings.contact.phone);
  const email = settings.contact.email;
  const addressLines = buildAddressLines(settings.contact);
  const whatsappHref = toWhatsAppHref(settings.contact.whatsapp || settings.contact.phone);
  const socialLinks = [
    { key: "Instagram", href: settings.social.instagram },
    { key: "Facebook", href: settings.social.facebook },
    { key: "YouTube", href: settings.social.youtube },
    { key: "LinkedIn", href: settings.social.linkedin },
  ].filter((s) => s.href);

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <Header />

      {/* Hero — same treatment as gallery */}
      <div className="w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] relative overflow-hidden flex items-center justify-center text-center px-4 pt-36 sm:pt-40 md:pt-44 lg:pt-48">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about.webp"
            alt="Contact Background"
            fill
            className="object-cover opacity-50 grayscale-[10%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1622] via-[#0c1622]/90 to-[#1a2c42]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
        </div>

        <div
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#395c80] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse z-0" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 z-0" />

        <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-12 sm:pb-16 lg:pb-24 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 tracking-normal font-malayalam-display drop-shadow-lg leading-[1.65] overflow-visible py-2">
            ബന്ധപ്പെടാം
          </h1>
          <p className="text-white/90 text-base sm:text-xl max-w-3xl mx-auto leading-[1.75] font-medium font-malayalam drop-shadow-md px-2">
            ഞങ്ങളുടെ ഇംഗ്ലീഷ് കോഴ്‌സുകളെക്കുറിച്ച് സംശയങ്ങളുണ്ടോ അതോ സഹായം ആവശ്യമുണ്ടോ? നിങ്ങളുടെ പഠനയാത്രയിൽ സഹായിക്കാൻ ഞങ്ങളുടെ ടീം സന്നദ്ധരാണ്.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 pb-24 sm:pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-stretch">
          {/* Left column */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            <div className="flex-1 bg-white rounded-[28px] border border-gray-100 shadow-[0_12px_40px_rgba(15,23,42,0.04)] p-6 sm:p-8 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0c1622] font-malayalam mb-7">
                കോൺടാക്റ്റ് വിവരങ്ങൾ
              </h2>

              <div className="flex flex-col gap-5 flex-1">
                <a
                  href={phoneHref}
                  className="flex gap-4 items-start rounded-2xl border border-gray-100 bg-[#FAFBFC] p-4 hover:border-[#395c80]/30 hover:bg-white transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#395c80]/10 text-[#395c80] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className={labelClass}>വിളിക്കൂ</p>
                    <p className="text-[#0c1622] font-semibold text-sm sm:text-base break-all">
                      {phoneLabel || "—"}
                    </p>
                  </div>
                </a>

                <a
                  href={email ? `mailto:${email}` : undefined}
                  className="flex gap-4 items-start rounded-2xl border border-gray-100 bg-[#FAFBFC] p-4 hover:border-emerald-300/50 hover:bg-white transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className={labelClass}>ഇമെയിൽ</p>
                    <p className="text-[#0c1622] font-semibold text-sm sm:text-base break-all">
                      {email || "—"}
                    </p>
                  </div>
                </a>

                <div className="flex gap-4 items-start rounded-2xl border border-gray-100 bg-[#FAFBFC] p-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className={labelClass}>ഞങ്ങളുടെ ഓഫീസ്</p>
                    <p className="text-[#0c1622] font-semibold text-sm sm:text-base leading-relaxed">
                      {addressLines.length
                        ? addressLines.map((line) => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-7 pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 font-malayalam">
                    ഞങ്ങളെ പിന്തുടരൂ
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.key}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#395c80] bg-[#F4F7FA] hover:bg-[#0c1622] hover:text-white transition-colors"
                      >
                        {social.key}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-[28px] bg-[#0c1622] p-6 sm:p-7 text-white relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-8 w-36 h-36 bg-emerald-500/25 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-2">
                    WhatsApp
                  </p>
                  <h3 className="text-lg font-bold font-malayalam leading-snug">
                    വാട്സാപ്പിലൂടെ ബന്ധപ്പെടാം
                  </h3>
                  <p className="text-white/60 text-sm mt-2 font-malayalam leading-relaxed">
                    സംശയങ്ങൾക്ക് വേഗത്തിൽ മറുപടി ലഭിക്കും.
                  </p>
                </div>
                <span className="shrink-0 w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884" />
                  </svg>
                </span>
              </div>
            </a>
          </div>

          {/* Form column */}
          <div className="lg:col-span-8 h-full">
            <div className="h-full bg-white rounded-[28px] border border-gray-100 shadow-[0_12px_40px_rgba(15,23,42,0.04)] p-6 sm:p-8 lg:p-10 flex flex-col">
              {isSubmitted ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0c1622] font-malayalam mb-3">
                    സന്ദേശം അയച്ചു!
                  </h2>
                  <p className="text-gray-500 max-w-md font-malayalam leading-relaxed mb-8">
                    ഞങ്ങളെ ബന്ധപ്പെട്ടതിന് നന്ദി. ഉടൻ തന്നെ മറുപടി നൽകുന്നതാണ്.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm font-semibold text-[#395c80] hover:underline font-malayalam"
                  >
                    മറ്റൊരു സന്ദേശം അയക്കാം
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0c1622] font-malayalam leading-snug">
                      ഞങ്ങൾക്ക് സന്ദേശമയക്കാം
                    </h2>
                    <p className="text-gray-500 mt-2 font-malayalam text-sm sm:text-base">
                      താഴെ കാണുന്ന ഫോം പൂരിപ്പിക്കുക — ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടുന്നതാണ്.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>പേര്</label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={fieldClass}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>ഇമെയിൽ</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={fieldClass}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>വിഷയം</label>
                      <input
                        required
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={fieldClass}
                        placeholder="വിഷയം രേഖപ്പെടുത്തുക"
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <label className={labelClass}>നിങ്ങളുടെ സന്ദേശം</label>
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`${fieldClass} resize-none flex-1 min-h-[140px]`}
                        placeholder="സന്ദേശം ഇവിടെ ടൈപ്പ് ചെയ്യുക..."
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-2xl bg-[#0c1622] text-white text-sm font-bold hover:bg-[#29425e] disabled:opacity-70 transition-colors font-malayalam"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            അയക്കുന്നു...
                          </>
                        ) : (
                          <>
                            സന്ദേശം അയക്കാം
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
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
