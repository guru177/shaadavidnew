import React, { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess?: () => void }) {
  const [view, setView] = useState<'login' | 'register' | 'register_success'>('login');

  // Reset view when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('login'), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0c1622]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top Accent Gradient */}
        <div className="w-full h-2 bg-gradient-to-r from-[#29425e] to-[#395c80]"></div>

        <div className="p-8">
          {view === 'login' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium text-[#0c1622] mb-2">Welcome Back</h2>
                <p className="text-gray-500 text-sm">Sign in to continue your learning journey.</p>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs font-medium text-[#395c80] hover:text-[#29425e] transition-colors">
                      Forgot Password?
                    </a>
                  </div>
                  <input 
                    type="password" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="button" 
                  onClick={() => {
                    if (onSuccess) onSuccess();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-[#29425e] to-[#395c80] text-white py-3 rounded-lg font-medium text-sm tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-2"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setView('register')}
                    className="font-medium text-[#395c80] hover:text-[#29425e] transition-colors"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </div>
          ) : view === 'register' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium text-[#0c1622] mb-2">Create Account</h2>
                <p className="text-gray-500 text-sm">Join us to start mastering English today.</p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input 
                    type="password" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="button" 
                  onClick={() => setView('register_success')}
                  className="w-full bg-gradient-to-r from-[#29425e] to-[#395c80] text-white py-3 rounded-lg font-medium text-sm tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-2"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{' '}
                  <button 
                    onClick={() => setView('login')}
                    className="font-medium text-[#395c80] hover:text-[#29425e] transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-[#0c1622] mb-3">Account Created!</h2>
              <p className="text-gray-500 text-[15px] mb-8 leading-relaxed max-w-[280px]">
                Welcome to Shaa David. Your account has been successfully registered. You can now log in.
              </p>
              <button 
                onClick={() => setView('login')}
                className="w-full border-2 border-[#395c80] text-[#395c80] py-3 rounded-lg font-medium text-sm hover:bg-[#395c80] hover:text-white transition-colors duration-300"
              >
                Continue to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
