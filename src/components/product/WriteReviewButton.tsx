"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  productId: string;
  productName: string;
  productImage: string;
  shortDescription: string;
};

export default function WriteReviewButton({
  productId,
  productName,
  productImage,
  shortDescription,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!rating) {
      setError("ദയവായി റേറ്റിംഗ് തിരഞ്ഞെടുക്കുക");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, title, content, rating }),
      });

      if (!res.ok) throw new Error("Failed");

      setIsOpen(false);
      setRating(0);
      setName("");
      setTitle("");
      setContent("");
      alert("നന്ദി! നിങ്ങളുടെ റിവ്യൂ സമർപ്പിച്ചു. അംഗീകാരത്തിന് ശേഷം ഇത് വെബ്‌സൈറ്റിൽ കാണിക്കും.");
    } catch {
      setError("റിവ്യൂ സമർപ്പിക്കുന്നതിൽ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm text-[15px] font-medium text-[#0c1622] hover:bg-gray-50 transition-colors font-malayalam"
      >
        ഉപഭോക്തൃ അവലോകനം എഴുതുക
      </button>

      {portalReady &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col font-malayalam"
              style={{ animation: "modalFadeIn 0.2s ease-out forwards" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-medium text-[#0c1622]">ഒരു റിവ്യൂ എഴുതുക</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                  <img
                    src={productImage}
                    alt="Product"
                    className="w-14 h-14 object-contain border border-gray-100 rounded-md bg-gray-50 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-medium text-[#0c1622] truncate">{productName}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{shortDescription}</p>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[15px] font-medium text-[#0c1622] mb-2">നിങ്ങളുടെ പേര്</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[15px] font-medium text-[#0c1622] mb-2">മൊത്തത്തിലുള്ള റേറ്റിംഗ്</label>
                      <div className="flex gap-2 items-center h-[42px]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                              (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[15px] font-medium text-[#0c1622] mb-2">ഒരു തലക്കെട്ട് ചേർക്കുക</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ഏറ്റവും പ്രധാനപ്പെട്ട കാര്യം എന്താണ്?"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[15px] font-medium text-[#0c1622] mb-2">ഒരു റിവ്യൂ എഴുതി ചേർക്കുക</label>
                    <textarea
                      rows={3}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="ഈ ഉൽപ്പന്നത്തെക്കുറിച്ച് നിങ്ങൾക്ക് എന്തു തോന്നുന്നു?"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all placeholder:text-gray-400 resize-none"
                      required
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting..." : "റിവ്യൂ സമർപ്പിക്കുക"}
                  </button>
                </form>
              </div>
            </div>
            <style>{`
              @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>
          </div>,
          document.body
        )}
    </>
  );
}
