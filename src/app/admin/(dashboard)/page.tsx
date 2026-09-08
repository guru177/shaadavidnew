import React from "react";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { buildDashboardStats, type DashboardOrder, type DashboardProduct } from "@/lib/dashboard";
import {
  CitiesBarChart,
  PaymentPieChart,
  ProductBarChart,
  RevenueAreaChart,
  StatusPieChart,
} from "@/components/admin/DashboardCharts";

function formatInr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default async function AdminDashboardPage() {
  const db = getDb();
  const orders = (db.orders || []) as DashboardOrder[];
  const products = (db.products || []) as DashboardProduct[];
  const users = db.users || [];
  const reviews = db.reviews || [];
  const blogs = db.blogs || [];

  const stats = buildDashboardStats(orders, products, users.length);
  const pendingReviews = reviews.filter((r: { status?: string }) => r.status === "pending").length;

  const cards = [
    {
      title: "Total Revenue",
      value: formatInr(stats.totalRevenue),
      trend: stats.revenueTrend,
      hint: "vs last month",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: String(stats.totalOrders),
      trend: stats.ordersTrend,
      hint: "vs last month",
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      color: "bg-violet-500",
    },
    {
      title: "Avg. Order Value",
      value: formatInr(stats.avgOrderValue),
      trend: { label: `${stats.pendingCount} pending`, positive: stats.pendingCount === 0 },
      hint: "open orders",
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      color: "bg-emerald-500",
    },
    {
      title: "Paid Revenue",
      value: formatInr(stats.paidRevenue),
      trend: {
        label: `${stats.confirmedCount + stats.shippedCount + stats.deliveredCount} active`,
        positive: true,
      },
      hint: "fulfilled pipeline",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#0c1622]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Revenue, orders, and inventory at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600">
            {products.length} products
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600">
            {blogs.length} blogs
          </span>
          {pendingReviews > 0 && (
            <Link
              href="/admin/products"
              className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700"
            >
              {pendingReviews} pending reviews
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0c1622] mt-2">{stat.value}</h3>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${stat.color}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`text-sm font-bold ${stat.trend.positive ? "text-emerald-600" : "text-rose-500"}`}
              >
                {stat.trend.label}
              </span>
              <span className="text-xs text-gray-400 font-medium">{stat.hint}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="text-base font-bold text-[#0c1622]">Revenue (6 months)</h2>
              <p className="text-sm text-gray-500">Monthly sales from confirmed payments & orders</p>
            </div>
          </div>
          <RevenueAreaChart data={stats.revenueByMonth} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-2">
            <h2 className="text-base font-bold text-[#0c1622]">Order status</h2>
            <p className="text-sm text-gray-500">Pipeline distribution</p>
          </div>
          <StatusPieChart data={stats.statusPie} />
          <div className="grid grid-cols-2 gap-2 mt-1">
            {[
              { label: "Pending", value: stats.pendingCount, color: "bg-amber-100 text-amber-700" },
              { label: "Confirmed", value: stats.confirmedCount, color: "bg-emerald-100 text-emerald-700" },
              { label: "Shipped", value: stats.shippedCount, color: "bg-blue-100 text-blue-700" },
              { label: "Delivered", value: stats.deliveredCount, color: "bg-indigo-100 text-indigo-700" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl px-3 py-2 text-center ${s.color}`}>
                <div className="text-lg font-bold">{s.value}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wide opacity-80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-2">
            <h2 className="text-base font-bold text-[#0c1622]">Top products</h2>
            <p className="text-sm text-gray-500">By revenue</p>
          </div>
          <ProductBarChart data={stats.topProducts} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-2">
            <h2 className="text-base font-bold text-[#0c1622]">Payments</h2>
            <p className="text-sm text-gray-500">Paid vs other</p>
          </div>
          <PaymentPieChart data={stats.paymentPie} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-2">
            <h2 className="text-base font-bold text-[#0c1622]">Orders by city</h2>
            <p className="text-sm text-gray-500">Top shipping locations</p>
          </div>
          <CitiesBarChart data={stats.topCities} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-[#0c1622]">Recent orders</h2>
              <p className="text-sm text-gray-500">Latest purchases across the store</p>
            </div>
            <Link
              href="/admin/orders"
              className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="text-sm font-bold text-[#395c80]">{order.id}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0 uppercase">
                            {(order.customerDetails?.name || order.shippingAddress?.name || "U").charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#0c1622]">
                              {order.shippingAddress?.name || order.customerDetails?.name || "—"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.shippingAddress?.mobile || order.customerDetails?.mobile || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="text-sm font-medium text-gray-700 max-w-[220px] truncate">
                          {order.product}
                        </div>
                        <div className="text-xs font-bold text-emerald-600">{order.amount}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="text-sm text-gray-600">{order.date}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
                            order.status === "Confirmed" || order.status === "Verified"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "Pending"
                                ? "bg-amber-100 text-amber-700"
                                : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Delivered"
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#0c1622]">Inventory alerts</h2>
            <p className="text-sm text-gray-500">Products with stock ≤ 10</p>
          </div>

          {stats.lowStock.length === 0 ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-6 text-center">
              <p className="text-sm font-semibold text-emerald-700">Stock looks healthy</p>
              <p className="text-xs text-emerald-600/80 mt-1">No products under the low-stock threshold.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {stats.lowStock.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0c1622] truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.id}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg ${
                      p.stock === 0 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-2 border-t border-gray-100 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick links</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/admin/orders", label: "Orders" },
                { href: "/admin/products", label: "Products" },
                { href: "/admin/settings", label: "Settings" },
                { href: "/admin/blogs", label: "Blogs" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-center text-sm font-semibold text-[#395c80] bg-[#F4F7FA] hover:bg-gray-100 rounded-xl py-2.5 border border-gray-100 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
