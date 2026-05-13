import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';

export default async function AdminDashboardPage() {
  const db = getDb();
  const orders = db.orders || [];
  const users = db.users || [];
  
  // Calculate stats
  const totalRevenue = orders.reduce((acc: number, order: any) => {
    // extract number from "₹499.00"
    const amount = parseFloat(order.amount.replace(/[^0-9.]/g, ''));
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const pendingCount = orders.filter((o: any) => o.status === 'Pending').length;
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0c1622]">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: '+12%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-blue-500' },
          { title: 'Total Students', value: users.length.toString(), trend: '+5%', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-emerald-500' },
          { title: 'Pending Orders', value: pendingCount.toString(), trend: '-2%', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'bg-amber-500' },
          { title: 'Total Orders', value: orders.length.toString(), trend: '+18%', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</p>
                <h3 className="text-3xl font-bold text-[#0c1622] mt-2">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}-500/30`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-sm font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{stat.trend}</span>
              <span className="text-xs text-gray-400 font-medium">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Users Who Purchased Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-bold text-[#0c1622]">Recent Purchasers</h2>
            <p className="text-sm text-gray-500">Users who recently bought the English Companion</p>
          </div>
          <Link href="/admin/orders" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 transition-colors">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Order ID</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Customer Details</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Product</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">No recent orders.</td>
                </tr>
              ) : orders.slice(0, 5).map((user: any, i: number) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-[#395c80]">{user.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0 uppercase">
                        {user.customerDetails?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0c1622]">{user.customerDetails?.name}</div>
                        <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:gap-2">
                          <span>{user.customerDetails?.mobile}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-700">{user.product}</div>
                    <div className="text-xs font-bold text-emerald-600">{user.amount}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600 font-medium">{user.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
                      user.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                      user.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      user.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href="/admin/orders" className="text-gray-400 hover:text-blue-600 transition-colors p-2 inline-block">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
