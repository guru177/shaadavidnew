"use client";

import React from "react";

interface TrackPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

const steps = [
  {
    id: 1,
    label: "Order Placed",
    date: "15 April 2026, 10:32 AM",
    description: "Your order was confirmed and payment received.",
    done: true,
  },
  {
    id: 2,
    label: "Processing",
    date: "15 April 2026, 02:15 PM",
    description: "Your order is being packed at our warehouse.",
    done: true,
  },
  {
    id: 3,
    label: "Dispatched",
    date: "16 April 2026, 09:00 AM",
    description: "Package handed over to Delhivery courier.",
    done: true,
  },
  {
    id: 4,
    label: "In Transit",
    date: "17 April 2026, 06:45 AM",
    description: "Package is on its way to your city.",
    done: true,
    active: true,
  },
  {
    id: 5,
    label: "Out for Delivery",
    date: "Est. 18 April 2026",
    description: "Your package will be delivered today.",
    done: false,
  },
  {
    id: 6,
    label: "Delivered",
    date: "Est. 18 April 2026",
    description: "Package delivered to your address.",
    done: false,
  },
];

export default function TrackPackageModal({
  isOpen,
  onClose,
  orderId = "#OD-3847291847",
}: TrackPackageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.15)] border border-white overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0c1622] to-[#1a2c42] px-8 py-7 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#395c80]/40 rounded-full blur-2xl" />
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-white text-lg font-semibold">Track Package</h2>
            </div>
            <p className="text-white/60 text-sm pl-11">Order {orderId}</p>
          </div>
        </div>

        {/* Courier Info */}
        <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8fafc]">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Courier Partner</p>
            <p className="font-semibold text-[#0c1622] text-sm">Delhivery Express</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">AWB Number</p>
            <p className="font-semibold text-[#395c80] text-sm font-mono">DL-84729183740</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Expected By</p>
            <p className="font-semibold text-emerald-600 text-sm">18 April 2026</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-8 py-6 overflow-y-auto max-h-[360px]">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#0c1622] via-[#395c80]/40 to-gray-100" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={step.id} className="flex gap-5 relative">
                  {/* Dot */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    {step.active ? (
                      <div className="w-9 h-9 rounded-full bg-[#0c1622] flex items-center justify-center shadow-lg shadow-[#0c1622]/30 ring-4 ring-[#0c1622]/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                      </div>
                    ) : step.done ? (
                      <div className="w-9 h-9 rounded-full bg-[#0c1622] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`font-semibold text-sm ${step.done ? 'text-[#0c1622]' : 'text-gray-400'} ${step.active ? 'text-[#0c1622]' : ''}`}>
                          {step.label}
                          {step.active && (
                            <span className="ml-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Live
                            </span>
                          )}
                        </p>
                        <p className={`text-xs mt-0.5 ${step.done ? 'text-gray-500' : 'text-gray-300'}`}>{step.description}</p>
                      </div>
                      <p className={`text-xs flex-shrink-0 font-medium ${step.done ? 'text-gray-500' : 'text-gray-300'}`}>{step.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-[#f8fafc] flex items-center justify-between">
          <p className="text-xs text-gray-400">Last updated: 17 Apr, 06:45 AM</p>
          <button
            onClick={onClose}
            className="bg-[#0c1622] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a2c42] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
