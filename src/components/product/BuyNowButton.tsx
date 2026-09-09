"use client";

import React, { useState } from "react";
import type { ShippingAddress } from "@/types/product";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

type Props = {
  productId: string;
  productName: string;
  price: number;
  image?: string;
  disabled?: boolean;
  quantity?: number;
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const emptyAddress: ShippingAddress = {
  name: "",
  mobile: "",
  pincode: "",
  flat: "",
  area: "",
  city: "",
  state: "",
};

export default function BuyNowButton({
  productId,
  productName,
  price,
  image,
  disabled,
  quantity = 1,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Razorpay" | "COD">("Razorpay");

  const qty = Math.max(1, quantity);
  const lineTotal = Number(price) * qty;
  const formattedPrice = `₹${lineTotal.toFixed(2)}`;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setAddress(emptyAddress);
      setOrderError("");
      setOrderId("");
      setPaymentId("");
      setIsSubmitting(false);
    }, 300);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");
    setStep(2);
  };

  const handleRazorpayPay = async () => {
    setOrderError("");
    setIsSubmitting(true);

    try {
      if (paymentMethod === "COD") {
        const codRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            qty,
            address,
            paymentMethod: "COD",
            status: "Confirmed",
            paymentStatus: "Unpaid",
          }),
        });
        const codData = await codRes.json();
        if (!codRes.ok) throw new Error(codData.error || "Failed to place COD order");
        setOrderId(codData.id);
        setPaymentId("");
        setStep(3);
        setIsSubmitting(false);
        return;
      }

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty, address }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // Local mock keys — complete payment without opening Razorpay checkout
      if (orderData.mock) {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: "local_mock",
            productId,
            qty,
            address,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || "Payment verification failed");
        }
        setOrderId(verifyData.id);
        setPaymentId(verifyData.razorpayPaymentId);
        setStep(3);
        setIsSubmitting(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Shaa David",
        description: `${productName} ×${qty}`,
        image: image || "/product.webp",
        order_id: orderData.orderId,
        prefill: {
          name: address.name,
          contact: address.mobile,
        },
        notes: {
          productId,
          shippingCity: address.city,
        },
        theme: {
          color: "#29425e",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                productId,
                qty,
                address,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            setOrderId(verifyData.id);
            setPaymentId(verifyData.razorpayPaymentId);
            setStep(3);
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Verification failed";
            setOrderError(message);
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setOrderError("പേയ്‌മെന്റ് പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.");
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setOrderError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        suppressHydrationWarning
        className="flex-1 py-3.5 sm:py-4 w-full bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] text-white rounded-full font-bold text-[14px] md:text-[16px] uppercase flex items-center justify-center gap-2 hover:shadow-lg transition-shadow shadow-sm font-malayalam disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0-3l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1v2h2l3.6 7.59zm3.5-3v-3h-3l4-4 4 4h-3v3h-2z" />
        </svg>
        ഇപ്പോൾ വാങ്ങുക
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] font-malayalam"
            style={{ animation: "modalFadeIn 0.2s ease-out forwards" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)]">
              <h2 className="text-xl font-medium text-white">സുരക്ഷിതമായ ചെക്ക്ഔട്ട്</h2>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex border-b border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 relative">
              {["വിലാസം", "പേയ്‌മെന്റ്", "പൂർത്തിയായി"].map((lbl, idx) => {
                const s = idx + 1;
                const isActive = step === s;
                const isPast = step > s;
                return (
                  <div
                    key={lbl}
                    className={`flex-1 text-center py-3 text-[11px] sm:text-sm font-medium border-b-[3px] transition-all duration-300 ${
                      isActive
                        ? "border-[#395c80] text-[#395c80]"
                        : isPast
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-400"
                    }`}
                  >
                    {lbl}
                  </div>
                );
              })}
            </div>

            <div
              className={`bg-gray-50 flex-1 min-h-0 ${
                step === 3
                  ? "p-3 sm:p-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  : "p-6 overflow-y-auto"
              }`}
            >
              {step === 1 && (
                <form id="checkout-form" onSubmit={handleAddressSubmit} className="space-y-4">
                  <h3 className="text-lg font-medium text-[#0c1622] mb-4">ഡെലിവറി വിലാസം ചേർക്കുക</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">പൂർണ്ണനാമം</label>
                      <input
                        type="text"
                        required
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">മൊബൈൽ നമ്പർ</label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        title="10 digit mobile number"
                        value={address.mobile}
                        onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">പിൻ കോഡ്</label>
                      <input
                        type="text"
                        required
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ഫ്ലാറ്റ്, വീട്ടു നമ്പർ, കെട്ടിടം</label>
                      <input
                        type="text"
                        required
                        value={address.flat}
                        onChange={(e) => setAddress({ ...address, flat: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">സ്ഥലം, തെരുവ്, വില്ലേജ്</label>
                    <textarea
                      required
                      rows={3}
                      value={address.area}
                      onChange={(e) => setAddress({ ...address, area: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">നഗരം</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">സംസ്ഥാനം</label>
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6 flex flex-col items-center py-2">
                  <h3 className="text-lg font-medium text-[#0c1622] w-full text-center">പേയ്‌മെന്റ്</h3>

                  <div className="grid w-full max-w-md grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Razorpay")}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                        paymentMethod === "Razorpay"
                          ? "border-[#0c1622] bg-[#0c1622] text-white"
                          : "border-gray-200 text-[#0c1622]"
                      }`}
                    >
                      Pay online
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                        paymentMethod === "COD"
                          ? "border-[#0c1622] bg-[#0c1622] text-white"
                          : "border-gray-200 text-[#0c1622]"
                      }`}
                    >
                      Cash on delivery
                    </button>
                  </div>

                  <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-4">
                      {image && (
                        <img src={image} alt={productName} className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                      )}
                      <div>
                        <div className="font-semibold text-[#0c1622]">{productName}</div>
                        <div className="text-2xl font-bold text-[#395c80] mt-1">{formattedPrice}</div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 text-sm text-gray-600 leading-relaxed">
                      <div className="font-semibold text-[#0c1622] mb-1">ഷിപ്പിംഗ് വിലാസം</div>
                      {address.name}, {address.flat}, {address.area}
                      <br />
                      {address.city}, {address.state} - {address.pincode}
                      <br />
                      {address.mobile}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed">
                    UPI, Card, Netbanking, Wallet — Razorpay-യുടെ സുരക്ഷിത പേയ്‌മെന്റ് ഗേറ്റ്‌വേ വഴി പണമടയ്ക്കാം.
                  </p>

                  {orderError && (
                    <p className="text-red-500 text-sm font-semibold text-center max-w-md">{orderError}</p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-1 flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-tr from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)] mb-3">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                      <path
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-[#0c1622] mb-1.5">ഓർഡർ ചെയ്തതിന് നന്ദി!</h3>

                  <p className="text-gray-500 text-sm max-w-sm mx-auto mb-4 leading-relaxed">
                    നന്ദി, <strong className="text-[#0c1622]">{address.name}</strong>. നിങ്ങളുടെ ഓർഡർ
                    സ്ഥിരീകരിച്ചു. {productName} ഉടൻ അയയ്ക്കും.
                  </p>

                  <div className="w-full max-w-sm mx-auto">
                    <div className="bg-white border border-gray-100/50 rounded-2xl p-4 text-left shadow-lg shadow-gray-200/40">
                      <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                            ഓർഡർ സ്റ്റാറ്റസ്
                          </div>
                          <div className="text-sm font-bold text-emerald-600">
                            {paymentMethod === "COD" ? "Confirmed / COD" : "Paid / Confirmed"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[14px]">
                        {orderId && (
                          <div>
                            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                              Order ID
                            </div>
                            <div className="font-medium text-[#0c1622]">{orderId}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            തുക
                          </div>
                          <div className="font-medium text-[#0c1622]">{formattedPrice}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            പേയ്‌മെന്റ് രീതി
                          </div>
                          <div className="font-medium text-[#0c1622]">
                            {paymentMethod === "COD" ? "Cash on delivery" : "Razorpay"}
                          </div>
                        </div>
                        {paymentId && (
                          <div className="col-span-2">
                            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                              Razorpay Payment ID
                            </div>
                            <div className="font-medium text-[#0c1622] break-all text-xs">{paymentId}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {step < 3 && (
              <div className="border-t border-gray-100 p-4 sm:p-5 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-base sm:text-[17px] font-bold text-[#0c1622] w-full sm:w-auto text-center sm:text-left">
                  ആകെ: <span className="text-[#395c80] ml-1">{formattedPrice}</span>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrderError("");
                        setStep(step - 1);
                      }}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
                    >
                      പുറകിലേക്ക്
                    </button>
                  )}
                  {step === 1 ? (
                    <button
                      type="submit"
                      form="checkout-form"
                      className="flex-[2] sm:flex-none px-4 sm:px-8 py-2.5 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] hover:shadow-lg text-white rounded-xl font-medium shadow-sm transition-all text-sm sm:text-base whitespace-nowrap"
                    >
                      തുടരുക
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleRazorpayPay}
                      className="flex-[2] sm:flex-none px-4 sm:px-8 py-2.5 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] hover:shadow-lg text-white rounded-xl font-medium shadow-sm transition-all text-sm sm:text-base whitespace-nowrap disabled:opacity-70"
                    >
                      {isSubmitting
                        ? paymentMethod === "COD"
                          ? "Placing order..."
                          : "Opening Razorpay..."
                        : paymentMethod === "COD"
                          ? "Place COD order"
                          : "Pay with Razorpay"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="border-t border-gray-100 p-4 sm:p-5 bg-white flex flex-col sm:flex-row justify-center gap-2.5 shrink-0">
                {orderId && (
                  <a
                    href={`/track?order=${encodeURIComponent(orderId)}`}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0c1622] text-white text-sm font-semibold hover:bg-[#29425e] transition-colors"
                  >
                    ഓർഡർ ട്രാക്ക് ചെയ്യുക
                  </a>
                )}
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-2.5 bg-[linear-gradient(110deg,#29425e_0%,#395c80_100%)] hover:shadow-lg text-white rounded-xl font-medium shadow-sm transition-all"
                >
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
          `}</style>
        </div>
      )}
    </>
  );
}
