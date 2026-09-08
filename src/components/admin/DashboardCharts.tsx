"use client";

import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  Pending: "#f59e0b",
  Confirmed: "#10b981",
  Shipped: "#3b82f6",
  Delivered: "#6366f1",
};

const PAYMENT_COLORS = ["#10b981", "#f59e0b", "#94a3b8", "#ef4444", "#8b5cf6"];
const CITY_COLORS = ["#395c80", "#2C6ECB", "#10b981", "#f59e0b", "#8b5cf6"];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  fontSize: 12,
};

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-full min-h-[220px] flex items-center justify-center text-sm text-gray-400">
      {label}
    </div>
  );
}

export function RevenueAreaChart({
  data,
}: {
  data: { label: string; revenue: number; orders: number }[];
}) {
  const hasData = data.some((d) => d.revenue > 0 || d.orders > 0);
  if (!hasData) return <EmptyChart label="No revenue data yet" />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#395c80" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#395c80" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`)}
          width={52}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name) => {
            const n = typeof value === "number" ? value : Number(value) || 0;
            if (name === "revenue") return [`₹${n.toLocaleString("en-IN")}`, "Revenue"];
            return [n, "Orders"];
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#395c80"
          strokeWidth={2.5}
          fill="url(#revenueFill)"
          name="revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <EmptyChart label="No orders yet" />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={3}
          stroke="#fff"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value ?? 0, "Orders"]} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ProductBarChart({
  data,
}: {
  data: { name: string; fullName?: string; orders: number; revenue: number }[];
}) {
  if (!data.length) return <EmptyChart label="No product sales yet" />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={52}
          tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ""}
          formatter={(value, _name, item) => {
            const n = typeof value === "number" ? value : Number(value) || 0;
            const orders = item?.payload?.orders ?? 0;
            return [`₹${n.toLocaleString("en-IN")} · ${orders} order${orders === 1 ? "" : "s"}`, "Sales"];
          }}
        />
        <Bar dataKey="revenue" fill="#2C6ECB" radius={[8, 8, 0, 0]} name="revenue" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PaymentPieChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <EmptyChart label="No payment data yet" />;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          paddingAngle={2}
          stroke="#fff"
          strokeWidth={2}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CitiesBarChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <EmptyChart label="No city data yet" />;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={72}
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value ?? 0, "Orders"]} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={CITY_COLORS[i % CITY_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
