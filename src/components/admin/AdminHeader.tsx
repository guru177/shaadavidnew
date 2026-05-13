"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminHeader() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
         const pending = data.filter((o: any) => o.status === 'Pending');
         setNotifications(pending);
      })
      .catch(err => console.error(err));
  }, []);
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm relative z-10 shrink-0">
      
      {/* Search Bar */}
      <div className="w-96 relative hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input 
          type="text" 
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] transition-all outline-none text-sm font-medium"
          placeholder="Search orders, users, or blogs..."
        />
      </div>

      <div className="flex items-center gap-6 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                <h3 className="font-bold text-[#0c1622] text-sm">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">{notifications.length} New</span>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">You're all caught up!</p>
                    <p className="text-xs text-gray-500">No new notifications right now.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map((n, idx) => (
                      <Link key={idx} href="/admin/orders" onClick={() => setShowNotifications(false)} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 border border-amber-100 group-hover:bg-amber-100 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0c1622] mb-1">Pending Order Action</p>
                          <p className="text-xs text-gray-600 leading-relaxed"><span className="font-bold text-gray-900">{n.customerDetails?.name || 'A customer'}</span> placed an order that requires payment verification.</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium">{n.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-50 text-center bg-[#FAFAFA]">
                <Link href="/admin/orders" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-[#395c80] hover:text-[#29425e] transition-colors inline-flex items-center gap-1">
                  Manage Orders
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-[#0c1622]">Admin User</div>
            <div className="text-xs font-medium text-gray-500">Super Admin</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#29425e] to-[#395c80] flex items-center justify-center text-white font-bold shadow-md shadow-[#29425e]/20 group-hover:shadow-lg transition-shadow">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
