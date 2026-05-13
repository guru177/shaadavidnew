import React, { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess?: () => void }) {
  const [view, setView] = useState<'login' | 'register' | 'register_success' | 'forgot_password' | 'forgot_password_success'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

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
                    <button 
                      type="button"
                      onClick={() => setView('forgot_password')}
                      className="text-xs font-medium text-[#395c80] hover:text-[#29425e] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>
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
                  Don&apos;t have an account?{' '}
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
                  <div className="relative">
                    <input 
                      type={showRegisterPassword ? "text" : "password"} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showRegisterPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>
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
          ) : view === 'forgot_password' ? (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="mb-6">
                <button 
                  onClick={() => setView('login')}
                  className="text-gray-400 hover:text-[#29425e] transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back to login
                </button>
              </div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#29425e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#29425e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-medium text-[#0c1622] mb-2">Forgot Password?</h2>
                <p className="text-gray-500 text-sm">No worries, we'll send you reset instructions.</p>
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

                <button 
                  type="button" 
                  onClick={() => setView('forgot_password_success')}
                  className="w-full bg-gradient-to-r from-[#29425e] to-[#395c80] text-white py-3 rounded-lg font-medium text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Reset Password
                </button>
              </form>
            </div>
          ) : view === 'forgot_password_success' ? (
            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-[#0c1622] mb-3">Check your email</h2>
              <p className="text-gray-500 text-[15px] mb-8 leading-relaxed max-w-[280px]">
                We've sent password reset instructions to your email address.
              </p>
              <button 
                onClick={() => setView('login')}
                className="w-full bg-[#0c1622] text-white py-3 rounded-lg font-medium text-sm hover:bg-[#29425e] transition-colors duration-300"
              >
                Return to Login
              </button>
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
