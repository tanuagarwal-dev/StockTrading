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
};

export default function DashboardPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  const fetchData = () => {
    Promise.all([
      apiClient.get("/allHoldings"),
      apiClient.get("/allOrders"),
    ]).then(([holdingsRes, ordersRes]) => {
      setHoldings(holdingsRes.data);
      setOrders(ordersRes.data);
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

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchPrices = () => {
      apiClient
        .get("/prices")
        .then((res) => {
          const data = res.data as Record<string, number>;
          setLivePrices((prev) => ({
            ...prev,
            ...data,
          }));
        })
        .catch(() => {
          // ignore errors
        });
    };

    fetchPrices();
    intervalId = setInterval(fetchPrices, 5000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const realizedPnl = useMemo(
    () =>
      orders.reduce((sum, o) => {
        if (o.status === "EXECUTED" && o.mode === "SELL" && typeof o.realizedPnl === "number") {
          return sum + o.realizedPnl;
        }
        return sum;
      }, 0),
    [orders]
  );

  const unrealizedPnl = useMemo(
    () =>
      holdings.reduce((sum, h) => {
        if (!h || typeof h.price !== "number" || typeof h.avg !== "number") {
          return sum;
        }
        const currentPrice = livePrices[h.name] ?? h.price;
        return sum + (currentPrice - h.avg) * h.qty;
      }, 0),
    [holdings, livePrices]
  );

  const totalPnl = realizedPnl + unrealizedPnl;

  const formatPnl = (value: number) => value.toFixed(2);
  const pnlClass = (value: number) =>
    value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-900";

  return (
    <>
      <Menu />
      <section className="p-4 space-y-8">
        {/* Username */}
        <div>
          <h6 className="text-sm font-medium text-gray-700">Hi, User!</h6>
          <hr className="mt-2 border-gray-200" />
        </div>

        {/* P&L Summary */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">P&amp;L summary</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Realized P&amp;L</p>
              <p className={`text-lg font-semibold ${pnlClass(realizedPnl)}`}>
                {formatPnl(realizedPnl)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Unrealized P&amp;L</p>
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

          <hr className="border-gray-200" />
        </div>

        {/* Equity Section (static placeholder) */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Equity</p>

          <div className="flex items-center gap-6">
            {/* Left */}
            <div>
              <h3 className="text-2xl font-semibold text-black">3.74k</h3>
              <p className="text-sm text-gray-500">Margin available</p>
            </div>

            <div className="h-12 w-px bg-gray-200" />

            {/* Right */}
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                Margins used <span className="font-medium text-black">0</span>
              </p>
              <p>
                Opening balance{" "}
                <span className="font-medium text-black">3.74k</span>
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />
        </div>
      </section>
    </>
  );
}
