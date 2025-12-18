"use client";

import { useEffect, useMemo, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import apiClient from "@/lib/apiClient";

type Holding = {
  name: string;
  qty: number;
  avg: number;
  price: number;
};

type Order = {
  mode: string;
  status?: string;
  realizedPnl?: number;
  createdAt?: string;
};

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

  const fetchData = () => {
    Promise.all([apiClient.get("/allHoldings"), apiClient.get("/allOrders")])
      .then(([holdingsRes, ordersRes]) => {
        setHoldings(holdingsRes.data);
        setOrders(ordersRes.data);
      })
      .catch(() => {
        // keep silent for now; page can show zeros on failure
      });
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
    // include full end day
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
      <section className="space-y-6 p-4">
        {/* Header & filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">P&amp;L Report</h3>
            <p className="text-xs text-gray-500">
              Realized P&amp;L for executed SELL orders in the selected range,
              plus current unrealized P&amp;L from holdings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="text-gray-600">
              From:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ml-2 border px-2 py-1 text-sm"
              />
            </label>
            <label className="text-gray-600">
              To:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ml-2 border px-2 py-1 text-sm"
              />
            </label>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Realized P&amp;L (range)</p>
            <p className={`text-lg font-semibold ${pnlClass(realizedPnl)}`}>
              {formatPnl(realizedPnl)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Unrealized P&amp;L (current)</p>
            <p className={`text-lg font-semibold ${pnlClass(unrealizedPnl)}`}>
              {formatPnl(unrealizedPnl)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Total P&amp;L</p>
            <p className={`text-lg font-semibold ${pnlClass(totalPnl)}`}>
              {formatPnl(totalPnl)}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}


