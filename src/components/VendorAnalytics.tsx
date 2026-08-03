"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { baseUrL } from "@/env/URLs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Activity,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  Eye,
} from "lucide-react";

interface Order {
  orderId: string;
  productName: string;
  amount: number;
  currency: string;
  status: string;
  dateCreated: string;
  quantity: number;
  customerId?: string;
}

interface OrderStats {
  allOrdersCount: number;
  processingOrdersCount: number;
  cancelledOrdersCount: number;
  failedOrdersCount: number;
  completedOrdersCount: number;
  inTransitOrdersCount: number;
  InTransitOrdersCount: number;
  paymentCompletedCount: number;
}

type DateFilter = "today" | "week" | "month" | "year" | "all";

const STATUS_COLORS: Record<string, string> = {
  PROCESSING: "#F59E0B",
  ACTIVE: "#7C3AED",
  FAILED: "#EF4444",
  IN_TRANSIT: "#3B82F6",
  COMPLETED: "#10B981",
  PAYMENT_COMPLETED: "#06B6D4",
  VENDOR_PROCESSING_START: "#14B8A6",
  VENDOR_PROCESSING_COMPLETED: "#6366F1",
  REJECTED: "#EF4444",
  PENDING: "#94A3B8",
};

const CHART_COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#7C3AED",
  "#EC4899",
  "#14B8A6",
  "#6366F1",
  "#06B6D4",
  "#F97316",
];

const GRADIENT_PRESETS = [
  { from: "#10B981", to: "#059669", label: "emerald" },
  { from: "#3B82F6", to: "#2563EB", label: "blue" },
  { from: "#F59E0B", to: "#D97706", label: "amber" },
  { from: "#8B5CF6", to: "#7C3AED", label: "violet" },
  { from: "#EC4899", to: "#DB2777", label: "pink" },
  { from: "#06B6D4", to: "#0891B2", label: "cyan" },
  { from: "#EF4444", to: "#DC2626", label: "red" },
  { from: "#F97316", to: "#EA580C", label: "orange" },
];

function getAuthFromStorage() {
  if (typeof window === "undefined") return null;
  for (const key of ["tailorDetails", "customerDetails", "userDetails"]) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      const token =
        data?.accessToken || data?.access_token || data?.data?.accessToken;
      if (token) return { token, key };
    } catch {
      /* ignore */
    }
  }
  return null;
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function isDateInFilter(dateStr: string, filter: DateFilter): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  switch (filter) {
    case "today":
      return date.toDateString() === now.toDateString();
    case "week": {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo;
    }
    case "month": {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return date >= monthAgo;
    }
    case "year": {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      return date >= yearAgo;
    }
    default:
      return true;
  }
}

function groupByDate(orders: Order[], filter: DateFilter) {
  const map = new Map<string, { revenue: number; orders: number; items: number }>();
  orders.forEach((o) => {
    if (!isDateInFilter(o.dateCreated, filter)) return;
    let key: string;
    const d = new Date(o.dateCreated);
    if (filter === "today") {
      key = d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
    } else if (filter === "week" || filter === "month") {
      key = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    } else {
      key = d.toLocaleDateString("en-NG", { month: "short", year: "2-digit" });
    }
    const existing = map.get(key) || { revenue: 0, orders: 0, items: 0 };
    existing.revenue += o.amount || 0;
    existing.orders += 1;
    existing.items += o.quantity || 1;
    map.set(key, existing);
  });
  return Array.from(map.entries()).map(([name, value]) => ({
    name,
    revenue: value.revenue,
    orders: value.orders,
    items: value.items,
  }));
}

function groupByStatus(orders: Order[]) {
  const map = new Map<string, number>();
  orders.forEach((o) => {
    const count = map.get(o.status) || 0;
    map.set(o.status, count + 1);
  });
  return Array.from(map.entries()).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    rawName: name,
    value,
    color: STATUS_COLORS[name] || "#6B7280",
  }));
}

function groupByProduct(orders: Order[]) {
  const map = new Map<string, { revenue: number; orders: number; items: number }>();
  orders.forEach((o) => {
    const name = o.productName || "Unknown Product";
    const existing = map.get(name) || { revenue: 0, orders: 0, items: 0 };
    existing.revenue += o.amount || 0;
    existing.orders += 1;
    existing.items += o.quantity || 1;
    map.set(name, existing);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, ...value }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

function groupByDayOfWeek(orders: Order[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const map = new Map<string, number>();
  days.forEach((d) => map.set(d, 0));
  orders.forEach((o) => {
    const day = days[new Date(o.dateCreated).getDay()];
    if (!day) return;
    map.set(day, (map.get(day) || 0) + (o.amount || 0));
  });
  return days.map((day) => ({ name: day, revenue: map.get(day) || 0 }));
}

function getHourlyData(orders: Order[]) {
  const hours = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
  const map = new Map<string, number>();
  hours.forEach((h) => map.set(h, 0));
  orders.forEach((o) => {
    const hour = new Date(o.dateCreated).getHours();
    const bucket = `${Math.floor(hour / 2) * 2}:00`;
    map.set(bucket, (map.get(bucket) || 0) + (o.amount || 0));
  });
  return hours.map((h) => ({ name: h, revenue: map.get(h) || 0 }));
}

export default function VendorAnalytics() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ token: string } | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const a = getAuthFromStorage();
    if (a) setAuth({ token: a.token });
  }, []);

  const fetchAll = useCallback(async () => {
    if (!auth?.token) return;
    setLoading(true);
    setError(null);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${baseUrL}/order-stats-for-vendor`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
        fetch(`${baseUrL}/fetch-vendor-orders?page=0&size=1000`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        // Backend throws 500 when vendor has no orders — treat as empty stats
        const errorBody = await statsRes.json().catch(() => ({}));
        if (errorBody?.error?.includes("No order found")) {
          setStats(null);
        }
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const list = ordersData?.data || ordersData?.content || [];
        setOrders(list);
      } else {
        const errorBody = await ordersRes.json().catch(() => ({}));
        if (errorBody?.error?.includes("No order found")) {
          setOrders([]);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (auth) fetchAll();
  }, [auth, fetchAll]);

  const filteredOrders = useMemo(
    () => orders.filter((o) => isDateInFilter(o.dateCreated, dateFilter)),
    [orders, dateFilter]
  );

  const revenueData = useMemo(
    () => groupByDate(filteredOrders, dateFilter),
    [filteredOrders, dateFilter]
  );

  const statusData = useMemo(() => groupByStatus(filteredOrders), [filteredOrders]);
  const productData = useMemo(() => groupByProduct(filteredOrders), [filteredOrders]);
  const dayOfWeekData = useMemo(() => groupByDayOfWeek(filteredOrders), [filteredOrders]);
  const hourlyData = useMemo(() => getHourlyData(filteredOrders), [filteredOrders]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItems = filteredOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);

  const completedOrders = filteredOrders.filter(
    (o) => o.status === "COMPLETED" || o.status === "PAYMENT_COMPLETED"
  ).length;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Previous period comparison
  const prevPeriodOrders = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;
    switch (dateFilter) {
      case "today": {
        start = new Date(now);
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        break;
      }
      case "week": {
        start = new Date(now);
        start.setDate(start.getDate() - 14);
        end = new Date(now);
        end.setDate(end.getDate() - 7);
        break;
      }
      case "month": {
        start = new Date(now);
        start.setMonth(start.getMonth() - 2);
        end = new Date(now);
        end.setMonth(end.getMonth() - 1);
        break;
      }
      case "year": {
        start = new Date(now);
        start.setFullYear(start.getFullYear() - 2);
        end = new Date(now);
        end.setFullYear(end.getFullYear() - 1);
        break;
      }
      default:
        return [];
    }
    return orders.filter((o) => {
      const d = new Date(o.dateCreated);
      return d >= start && d <= end;
    });
  }, [orders, dateFilter]);

  const prevRevenue = prevPeriodOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const prevOrderCount = prevPeriodOrders.length;
  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const orderChange = prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0;

  const filterButtons: { label: string; value: DateFilter; icon: React.ReactNode }[] = [
    { label: "Today", value: "today", icon: <Activity className="w-3.5 h-3.5" /> },
    { label: "This Week", value: "week", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { label: "This Month", value: "month", icon: <Calendar className="w-3.5 h-3.5" /> },
    { label: "This Year", value: "year", icon: <Layers className="w-3.5 h-3.5" /> },
    { label: "All Time", value: "all", icon: <PieChartIcon className="w-3.5 h-3.5" /> },
  ];

  const statCards = [
    {
      label: "Total Revenue",
      value: totalRevenue,
      formatted: formatNaira(totalRevenue),
      icon: DollarSign,
      change: revenueChange,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-400/30",
      textColor: "text-emerald-50",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      formatted: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      change: orderChange,
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-400/30",
      textColor: "text-blue-50",
    },
    {
      label: "Avg Order Value",
      value: avgOrderValue,
      formatted: formatNaira(avgOrderValue),
      icon: CreditCard,
      change: null,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-400/30",
      textColor: "text-amber-50",
    },
    {
      label: "Items Sold",
      value: totalItems,
      formatted: totalItems.toLocaleString(),
      icon: Package,
      change: null,
      gradient: "from-[#164377] to-[#1e5fa3]",
      iconBg: "bg-violet-400/30",
      textColor: "text-violet-50",
    },
    {
      label: "Completion Rate",
      value: completionRate,
      formatted: `${completionRate.toFixed(1)}%`,
      icon: CheckCircle2,
      change: null,
      gradient: "from-cyan-500 to-blue-600",
      iconBg: "bg-cyan-400/30",
      textColor: "text-cyan-50",
    },
    {
      label: "Active Customers",
      value: new Set(filteredOrders.map((o) => o.customerId)).size,
      formatted: new Set(filteredOrders.map((o) => o.customerId)).size.toLocaleString(),
      icon: Activity,
      change: null,
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-400/30",
      textColor: "text-rose-50",
    },
  ];

  if (!auth) {
    return (
      <div className="py-6 w-full flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-surface-600 mb-2">Session not found. Please log in.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-surface-800">
            Analytics Dashboard
          </h2>
          <p className="text-sm text-surface-500 mt-0.5">
            Comprehensive insights into your sales performance and orders
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAll}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 px-3 py-2 rounded-xl transition-colors text-xs font-semibold shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? "animate-spin" : ""}`} />
            <span className="text-white text-xs font-semibold">Refresh</span>
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-2 mb-4 flex flex-wrap gap-1">
        <div className="flex items-center gap-1 px-2 mr-1">
          <Filter className="w-4 h-4 text-surface-400" />
          <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Filter</span>
        </div>
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setDateFilter(btn.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              dateFilter === btn.value
                ? "bg-primary-600 text-white shadow-sm scale-[1.02]"
                : "text-surface-600 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            <p className="text-sm text-surface-500">Loading your analytics...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center p-6 text-red-500 bg-white rounded-2xl border border-surface-100 shadow-card">
          <p className="font-medium text-surface-800">{error}</p>
          <button
            onClick={fetchAll}
            className="mt-4 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-100 p-8 text-center shadow-card">
          <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-7 h-7 text-primary-400" />
          </div>
          <h3 className="text-sm font-display font-bold text-surface-800 mb-1">No Sales Data Yet</h3>
          <p className="text-sm text-surface-500 max-w-md mx-auto mb-5">
            You don&apos;t have any orders on record. Once customers start placing orders, your analytics dashboard will light up with colorful charts and insights.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={fetchAll}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
            <button
              onClick={() => router.push("/inventory")}
              className="flex items-center gap-2 bg-white text-surface-800 border border-surface-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-50 transition-colors"
            >
              <Package className="w-4 h-4" />
              Manage Inventory
            </button>
          </div>
        </div>
      ) : (
          <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {statCards.map((stat, idx) => (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br ${stat.gradient} text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-4 -mt-4 blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-lg ${stat.iconBg} flex items-center justify-center backdrop-blur-sm`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    {stat.change !== null && (
                      <span
                        className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          stat.change >= 0 ? "bg-white/25" : "bg-white/25"
                        }`}
                      >
                        {stat.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        )}
                        {Math.abs(stat.change).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] font-medium opacity-80 ${stat.textColor}`}>{stat.label}</p>
                  <p className="text-base md:text-lg font-display font-bold mt-0.5">
                    {stat.formatted}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Status Overview Pills */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-4">
              {[
                { label: "All Orders", value: stats.allOrdersCount, color: "bg-slate-800", icon: Layers },
                { label: "Paid", value: stats.paymentCompletedCount, color: "bg-emerald-500", icon: CreditCard },
                { label: "Processing", value: stats.processingOrdersCount, color: "bg-amber-500", icon: Clock },
                { label: "Completed", value: stats.completedOrdersCount, color: "bg-blue-500", icon: CheckCircle2 },
                { label: "In Transit", value: stats.InTransitOrdersCount || stats.inTransitOrdersCount, color: "bg-indigo-500", icon: Truck },
                { label: "Cancelled", value: stats.cancelledOrdersCount, color: "bg-red-500", icon: XCircle },
                { label: "Failed", value: stats.failedOrdersCount, color: "bg-surface-500", icon: AlertIcon },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${s.color} rounded-2xl p-2 text-center text-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                  <s.icon className="w-3.5 h-3.5 mx-auto mb-0.5 opacity-80" />
                  <p className="text-lg font-display font-bold">{s.value}</p>
                  <p className="text-[10px] opacity-90 font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Charts Row 1: Revenue + Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Revenue & Orders Combo Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-surface-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-display font-bold text-surface-800">Revenue & Orders Overview</h3>
                  <p className="text-xs text-surface-500 mt-0.5">Track your sales alongside order volume</p>
                </div>
                <span className="text-[11px] text-surface-500 flex items-center gap-1 bg-surface-50 px-2 py-1 rounded-lg font-semibold">
                  <Calendar className="w-3 h-3" />
                  {filterButtons.find((f) => f.value === dateFilter)?.label}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <Tooltip
                    formatter={(value: any, name: any) =>
                      name === "revenue" ? formatNaira(value) : value
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-surface-600 font-medium">{value}</span>
                    )}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    fill="url(#revGrad)"
                    name="Revenue"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="orders"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                    name="Orders"
                    barSize={dateFilter === "today" ? 20 : 14}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Donut */}
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-4">
              <h3 className="text-base font-bold text-surface-900 mb-1">Order Status</h3>
              <p className="text-xs text-surface-500 mb-3">Distribution of order statuses</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={40}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-surface-600 font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2: Day of Week + Hourly + Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Sales by Day of Week - Radar */}
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-4">
              <h3 className="text-base font-bold text-surface-900 mb-1">Sales by Day</h3>
              <p className="text-xs text-surface-500 mb-3">Revenue distribution across weekdays</p>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={dayOfWeekData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <PolarRadiusAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                  <Radar
                    name="Revenue"
                    dataKey="revenue"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(v: any) => formatNaira(v)} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Sales */}
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-4">
              <h3 className="text-base font-bold text-surface-900 mb-1">Sales by Hour</h3>
              <p className="text-xs text-surface-500 mb-3">Revenue across time of day</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v: number) => formatNaira(v)}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-4">
              <h3 className="text-base font-bold text-surface-900 mb-1">Top Products</h3>
              <p className="text-xs text-surface-500 mb-3">Best performing products by revenue</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    stroke="#9CA3AF"
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={110}
                    tick={{ fontSize: 10 }}
                    stroke="#9CA3AF"
                  />
                  <Tooltip
                    formatter={(v: number) => formatNaira(v)}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={18}>
                    {productData.map((_, index) => (
                      <Cell key={`p-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products with Progress Bars */}
          <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-bold text-surface-800">Top Products Breakdown</h3>
                <p className="text-xs text-surface-500 mt-0.5">Revenue share of your best selling products</p>
              </div>
            </div>
            <div className="space-y-2">
              {productData.map((product, idx) => {
                const maxRevenue = productData[0]?.revenue || 1;
                const pct = (product.revenue / maxRevenue) * 100;
                return (
                  <div key={product.name} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-surface-800 truncate">{product.name}</span>
                        <span className="text-sm font-bold text-surface-700">{formatNaira(product.revenue)}</span>
                      </div>
                      <div className="w-full bg-surface-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-surface-500 w-14 text-right flex-shrink-0">
                      {product.orders} order{product.orders !== 1 ? "s" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
            <div className="p-4 border-b border-surface-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-bold text-surface-800">Recent Orders</h3>
                <p className="text-xs text-surface-500 mt-0.5">Latest transactions in the selected period</p>
              </div>
              <span className="text-[11px] font-semibold text-surface-500 bg-surface-50 px-2 py-1 rounded-lg">
                {filteredOrders.length} orders
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-100">
                <thead className="bg-surface-50">
                  <tr>
                    {["Order ID", "Product", "Date", "Qty", "Amount", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-100">
                  {filteredOrders.slice(0, 15).map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-primary-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-surface-600">
                        #{order.orderId.slice(-6)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-surface-800 max-w-[200px] truncate">
                        {order.productName || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-surface-600">
                        {new Date(order.dateCreated).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-surface-600">
                        {order.quantity || 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-surface-800">
                        {formatNaira(order.amount || 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="text-center p-8 text-surface-500">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-surface-300" />
                  <p className="font-medium text-surface-800">No orders for the selected period</p>
                  <p className="text-sm mt-0.5">Try changing your date filter</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AlertIcon(props: any) {
  return (
    <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <CheckCircle2 className="w-3 h-3" /> },
    PAYMENT_COMPLETED: { bg: "bg-cyan-100", text: "text-cyan-700", icon: <CreditCard className="w-3 h-3" /> },
    FAILED: { bg: "bg-red-100", text: "text-red-700", icon: <XCircle className="w-3 h-3" /> },
    REJECTED: { bg: "bg-red-100", text: "text-red-700", icon: <XCircle className="w-3 h-3" /> },
    IN_TRANSIT: { bg: "bg-blue-100", text: "text-blue-700", icon: <Truck className="w-3 h-3" /> },
    PROCESSING: { bg: "bg-amber-100", text: "text-amber-700", icon: <Clock className="w-3 h-3" /> },
  };
  const cfg = configs[status] || { bg: "bg-surface-100", text: "text-surface-700", icon: <Eye className="w-3 h-3" /> };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.icon}
      {status?.replace(/_/g, " ") || "Processing"}
    </span>
  );
}
