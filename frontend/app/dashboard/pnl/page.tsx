"use client";

import { useEffect, useMemo, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import { api, type Holding, type Order } from "@/lib/api";

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PnlReportPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const today = useMemo(() => new Date(), []);
  const thirtyDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  }, []);

  const [startDate, setStartDate] = useState<string>(
    toDateInputValue(thirtyDaysAgo)
  );
  const [endDate, setEndDate] = useState<string>(toDateInputValue(today));

  const fetchData = async () => {
    try {
      const [holdingsRes, ordersRes] = await Promise.all([
        api.getAllHoldings(),
        api.getAllOrders(),
      ]);
      setHoldings(holdingsRes);
      setOrders(ordersRes);
    } catch {
      // ignore fetch errors; UI will keep last data
    }
  };

  useEffect(() => {
    fetchData();

    const handler = () => {
      fetchData();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("portfolio-updated", handler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("portfolio-updated", handler);
      }
    };
  }, []);

  const realizedPnl = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return orders.reduce((sum, o) => {
      if (
        o.status === "EXECUTED" &&
        o.mode === "SELL" &&
        typeof o.realizedPnl === "number" &&
        o.createdAt
      ) {
        const d = new Date(o.createdAt);
        if (d >= start && d <= end) {
          return sum + o.realizedPnl;
        }
      }
      return sum;
    }, 0);
  }, [orders, startDate, endDate]);

  const unrealizedPnl = useMemo(
    () =>
      holdings.reduce((sum, h) => {
        if (!h || typeof h.price !== "number" || typeof h.avg !== "number") {
          return sum;
        }
        return sum + (h.price - h.avg) * h.qty;
      }, 0),
    [holdings]
  );

  const totalPnl = realizedPnl + unrealizedPnl;

  const formatPnl = (value: number) => value.toFixed(2);
  const pnlClass = (value: number) =>
    value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-900";

  return (
    <>
      <Menu />
      <section className="space-y-6 p-6">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            P&L Report
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your realized and unrealized profit & loss
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input title="date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input title="date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* P&L Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Realized P&L */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Realized P&L
              </h3>
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              (Executed sell orders in range)
            </p>
            <p className={`text-3xl font-bold ${pnlClass(realizedPnl)}`}>
              ₹{formatPnl(realizedPnl)}
            </p>
          </div>

          {/* Unrealized P&L */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Unrealized P&L
              </h3>
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              (Current holdings)
            </p>
            <p className={`text-3xl font-bold ${pnlClass(unrealizedPnl)}`}>
              ₹{formatPnl(unrealizedPnl)}
            </p>
          </div>

          {/* Total P&L */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg shadow border border-blue-700 dark:border-blue-600 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Total P&L</h3>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs opacity-90 mb-3">Realized + Unrealized</p>
            <p className="text-3xl font-bold">₹{formatPnl(totalPnl)}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Note:</strong> Realized P&L is calculated from executed
            SELL orders within the selected date range. Unrealized P&L reflects
            your current open positions.
          </p>
        </div>
      </section>
    </>
  );
}
