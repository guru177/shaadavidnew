"use client";

import React, { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0c1622]">Manage Orders</h1>
          <p className="text-gray-500 mt-1">Track purchases and update shipment statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0c1622]">All Orders ({orders.length})</h2>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Order ID & Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Customer</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Shipping Address</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Payment</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 align-top">
                      <div className="text-sm font-bold text-[#395c80]">{order.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.date}</div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="text-sm font-bold text-[#0c1622]">{order.customerDetails?.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.customerDetails?.mobile}</div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="text-xs text-gray-600 leading-relaxed max-w-xs">
                        {order.shippingAddress?.flat}, {order.shippingAddress?.area}<br/>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}<br/>
                        PIN: {order.shippingAddress?.pincode}
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="text-sm font-bold text-emerald-600 mb-1">{order.amount}</div>
                      {order.screenshotUrl ? (
                        <button 
                          onClick={() => setSelectedScreenshot(order.screenshotUrl)}
                          className="text-xs text-blue-600 underline hover:text-blue-800"
                        >
                          View Screenshot
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">No screenshot</span>
                      )}
                    </td>
                    <td className="py-4 px-6 align-top">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none ${
                          order.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedScreenshot(null)}>
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-xl overflow-hidden p-2" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img src={selectedScreenshot} alt="Payment Screenshot" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}

    </div>
  );
}
