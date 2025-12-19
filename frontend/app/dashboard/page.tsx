"use client";

// Metadata cannot be exported from client components
// This page requires client interactivity
import { useContext, useEffect, useMemo, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import apiClient from "@/lib/apiClient";
import GeneralContext from "@/context/GeneralContext";
import { useUser } from "@/context/UserContext";

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
  const { user, logout } = useUser();
  if (!user) return null;
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const { selectedStock, openBuyWindow, openSellWindow } =
    useContext(GeneralContext);

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
        .catch(() => {});
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
        if (
          o.status === "EXECUTED" &&
          o.mode === "SELL" &&
          typeof o.realizedPnl === "number"
        ) {
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
      <section className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <h6 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Hi, {user?.name || "User"}! 👋
          </h6>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome back to your trading dashboard
          </p>
        </div>

        {selectedStock && (
          <div className="bg-linear-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl shadow-lg p-4 md:p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 w-full sm:w-auto">
                <p className="text-xs md:text-sm font-medium text-blue-100">
                  Quick Trade
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  {selectedStock.symbol}
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="text-blue-100">Current Price:</span>
                  <span className="text-xl md:text-2xl font-semibold">
                    ₹
                    {(
                      livePrices[selectedStock.symbol] ?? selectedStock.price
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => openBuyWindow(selectedStock.symbol)}
                  className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm md:text-base font-semibold shadow-lg transition duration-200 transform hover:scale-105"
                >
                  Buy
                </button>
                <button
                  onClick={() => openSellWindow(selectedStock.symbol)}
                  className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm md:text-base font-semibold shadow-lg transition duration-200 transform hover:scale-105"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            P&L Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 md:p-5 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Realized P&L
              </p>
              <p
                className={`text-2xl md:text-3xl font-bold ${pnlClass(
                  realizedPnl
                )} dark:${pnlClass(realizedPnl)}`}
              >
                ₹{formatPnl(realizedPnl)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                From executed trades
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 md:p-5 border border-blue-200 dark:border-blue-800">
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Unrealized P&L
              </p>
              <p
                className={`text-2xl md:text-3xl font-bold ${pnlClass(
                  unrealizedPnl
                )} dark:${pnlClass(unrealizedPnl)}`}
              >
                ₹{formatPnl(unrealizedPnl)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                From open positions
              </p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 md:p-5 border border-purple-200 dark:border-purple-800 sm:col-span-2 lg:col-span-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total P&L
              </p>
              <p
                className={`text-2xl md:text-3xl font-bold ${pnlClass(
                  totalPnl
                )} dark:${pnlClass(totalPnl)}`}
              >
                ₹{formatPnl(totalPnl)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Overall profit/loss
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            Equity
          </h3>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <div className="flex-1">
              <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-5 md:p-6 border border-green-200 dark:border-green-800">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Margin Available
                </p>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{user.funds.available.toLocaleString("en-IN")}
                </h3>
              </div>
            </div>

            <div className="hidden md:block w-px h-24 bg-gray-200 dark:bg-gray-700" />

            <div className="flex-1 space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Margins Used
                </span>
                <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                  ₹0
                </span>
              </div>

              <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Opening Balance
                </span>
                <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                  ₹3.74k
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
