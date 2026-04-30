import React from 'react';

export default function AddressModal({ 
  isOpen, 
  onClose, 
  isEdit = false 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  isEdit?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center font-sans p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0c1622]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top Accent Gradient */}
        <div className="w-full h-2 bg-gradient-to-r from-[#29425e] to-[#395c80] shrink-0"></div>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-[#0c1622] mb-1">{isEdit ? 'Edit Address' : 'Add New Address'}</h2>
            <p className="text-gray-500 text-sm">Please fill in the details below for your shipping address.</p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={isEdit ? "John Doe" : ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue={isEdit ? "+91 9876543210" : ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
                <input 
                  type="text" 
                  defaultValue={isEdit ? "682011" : ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                  placeholder="6 digits [0-9] PIN code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <input 
                  type="text" 
                  defaultValue={isEdit ? "Kerala" : ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                  placeholder="Enter state"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">House No., Building Name</label>
              <input 
                type="text" 
                defaultValue={isEdit ? "Flat 402, Skyline Apartments" : ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm"
                placeholder="Enter house no. or building name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Road name, Area, Colony</label>
              <textarea 
                rows={2}
                defaultValue={isEdit ? "MG Road, Ernakulam, Kochi" : ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#395c80] focus:ring-1 focus:ring-[#395c80] transition-all bg-white text-sm resize-none"
                placeholder="Enter road name, area, colony"
              ></textarea>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="addressType" defaultChecked className="text-[#395c80] focus:ring-[#395c80]" />
                  <span className="text-sm text-gray-700">Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="addressType" className="text-[#395c80] focus:ring-[#395c80]" />
                  <span className="text-sm text-gray-700">Office</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={onClose}
                className="bg-gradient-to-r from-[#29425e] to-[#395c80] text-white px-8 py-2.5 rounded-lg font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {isEdit ? 'Save Changes' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
