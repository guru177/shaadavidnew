"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddressModal from "@/components/AddressModal";
import TrackPackageModal from "@/components/TrackPackageModal";
import InvoiceModal from "@/components/InvoiceModal";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    // In a real app, you would clear the session/token here
    router.push("/");
  };


  const openAddModal = () => {
    setIsEditingAddress(false);
    setIsAddressModalOpen(true);
  };

  const openEditModal = () => {
    setIsEditingAddress(true);
    setIsAddressModalOpen(true);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <Header />

      {/* Cover Background */}
      <div className="w-full h-[250px] lg:h-[300px] bg-gradient-to-br from-[#0c1622] via-[#1a2c42] to-[#395c80] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#395c80] rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 -mt-24 lg:-mt-32 pb-24 relative z-10">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">

            {/* User Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative mb-6">
                <div className="w-28 h-28 bg-gradient-to-tr from-[#29425e] to-[#4a77a6] rounded-full flex items-center justify-center text-white text-4xl font-light shadow-[0_0_40px_rgba(57,92,128,0.3)] ring-4 ring-white relative z-10">
                  JD
                </div>

              </div>

              <h1 className="text-2xl font-semibold text-[#0c1622] mb-1">John Doe</h1>
              <p className="text-[#395c80] font-medium text-sm mb-4">Premium Member</p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Joined April 2026
              </p>
            </div>

            {/* Navigation Sidebar */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden p-3">
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${activeTab === 'profile' ? 'bg-[#0c1622] text-white shadow-lg shadow-[#0c1622]/20' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="font-medium text-sm">Account Settings</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${activeTab === 'orders' ? 'bg-[#0c1622] text-white shadow-lg shadow-[#0c1622]/20' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  <span className="font-medium text-sm">My Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${activeTab === 'addresses' ? 'bg-[#0c1622] text-white shadow-lg shadow-[#0c1622]/20' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="font-medium text-sm">Saved Addresses</span>
                </button>

                <div className="h-px bg-gray-100 my-2 mx-4"></div>

                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left text-red-500 hover:bg-red-50/80 transition-all duration-300"
                >
                  <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  <span className="font-medium text-sm">Sign Out</span>
                </button>

              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">

            {/* Account Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-10">
                  <h2 className="text-3xl font-light text-[#0c1622] mb-2 tracking-tight">Personal Information</h2>
                  <p className="text-gray-500">Update your personal details and contact information.</p>
                </div>

                <form className="space-y-8 max-w-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group">
                      <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-medium text-gray-500 transition-colors group-focus-within:text-[#395c80]">First Name</label>
                      <input type="text" defaultValue="John" className="w-full border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-[#395c80] focus:ring-4 focus:ring-[#395c80]/10 transition-all bg-transparent text-[#0c1622] font-medium" />
                    </div>
                    <div className="relative group">
                      <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-medium text-gray-500 transition-colors group-focus-within:text-[#395c80]">Last Name</label>
                      <input type="text" defaultValue="Doe" className="w-full border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-[#395c80] focus:ring-4 focus:ring-[#395c80]/10 transition-all bg-transparent text-[#0c1622] font-medium" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-medium text-gray-500">Email Address</label>
                    <input type="email" defaultValue="john.doe@example.com" disabled className="w-full border-2 border-gray-100 rounded-xl px-5 py-4 bg-gray-50/50 text-gray-400 cursor-not-allowed font-medium" />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-emerald-500 font-semibold bg-emerald-50 px-2 py-1 rounded-md">Verified</span>
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-medium text-gray-500 transition-colors group-focus-within:text-[#395c80]">Phone Number</label>
                    <input type="tel" defaultValue="+91 9876543210" className="w-full border-2 border-gray-100 rounded-xl px-5 py-4 outline-none focus:border-[#395c80] focus:ring-4 focus:ring-[#395c80]/10 transition-all bg-transparent text-[#0c1622] font-medium" />
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center justify-end">
                    <button type="button" className="bg-gradient-to-r from-[#29425e] to-[#395c80] hover:from-[#1a2c42] hover:to-[#29425e] text-white px-10 py-3.5 rounded-xl font-medium transition-all duration-300 shadow-[0_8px_20px_rgba(41,66,94,0.2)] hover:shadow-[0_8px_25px_rgba(41,66,94,0.3)] hover:-translate-y-0.5">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-10 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-light text-[#0c1622] mb-2 tracking-tight">Order History</h2>
                    <p className="text-gray-500">Track and manage your recent purchases.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Premium Order Card */}
                  <div className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300 bg-white group">
                    {/* Header */}
                    <div className="bg-gray-50/80 border-b border-gray-100 px-8 py-5 flex flex-wrap gap-8 justify-between items-center text-sm">
                      <div className="flex gap-12">
                        <div>
                          <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">Order Placed</div>
                          <div className="font-semibold text-[#0c1622]">15 April 2026</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">Total Amount</div>
                          <div className="font-semibold text-[#0c1622]">₹499.00</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">Order ID</div>
                        <div className="font-semibold text-[#395c80]">#OD-3847291847</div>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                      <div className="w-28 h-36 bg-[#f8f9fa] rounded-xl p-3 flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                        <img src="/product.webp" alt="Product" className="w-full h-full object-contain drop-shadow-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 bg-emerald-50/80 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Arriving by 18 April
                        </div>
                        <h3 className="text-xl font-medium text-[#0c1622] mb-2">Shaa David English Companion</h3>
                        <p className="text-gray-500 text-sm mb-4">Quantity: 1</p>
                      </div>
                      <div className="w-full md:w-auto flex flex-col gap-3">
                        <button
                          onClick={() => setIsTrackModalOpen(true)}
                          className="w-full md:w-auto bg-[#0c1622] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#1a2c42] transition-colors shadow-md"
                        >
                          Track Package
                        </button>
                        <button
                          onClick={() => setIsInvoiceModalOpen(true)}
                          className="w-full md:w-auto border-2 border-gray-200 text-[#0c1622] px-8 py-3 rounded-xl text-sm font-medium hover:border-[#0c1622] transition-colors"
                        >
                          View Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-8">
                  <div>
                    <h2 className="text-3xl font-light text-[#0c1622] mb-2 tracking-tight">Saved Addresses</h2>
                    <p className="text-gray-500">Manage your shipping and billing locations.</p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="bg-[#395c80]/10 text-[#395c80] hover:bg-[#395c80] hover:text-white flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Default Address Card */}
                  <div className="border-2 border-[#395c80] bg-[#395c80]/5 rounded-2xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#395c80]/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                    <span className="absolute top-6 right-6 bg-[#395c80] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">Default</span>

                    <h3 className="text-lg font-semibold text-[#0c1622] mb-4">John Doe</h3>
                    <div className="space-y-2 text-gray-600 text-sm leading-relaxed mb-6">
                      <p>Flat 402, Skyline Apartments</p>
                      <p>MG Road, Ernakulam</p>
                      <p>Kochi, Kerala - 682011</p>
                      <p className="pt-2 font-medium">📞 +91 9876543210</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={openEditModal}
                        className="bg-white border border-gray-200 text-[#0c1622] px-6 py-2 rounded-lg text-sm font-medium hover:border-[#395c80] hover:text-[#395c80] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Secondary Address Card */}
                  <div
                    onClick={openAddModal}
                    className="border-2 border-dashed border-gray-200 bg-white rounded-2xl p-6 relative hover:border-gray-300 transition-colors flex flex-col justify-center items-center text-center cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#395c80]/10 transition-colors">
                      <svg className="w-8 h-8 text-gray-400 group-hover:text-[#395c80] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <h3 className="font-medium text-[#0c1622] mb-1">Add Another Address</h3>
                    <p className="text-sm text-gray-500">Save a new location for quick checkout</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        isEdit={isEditingAddress}
      />

      <TrackPackageModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        orderId="#OD-3847291847"
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        orderId="#OD-3847291847"
      />

      <Footer />
    </main>
  );
}
