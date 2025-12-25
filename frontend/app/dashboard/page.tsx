"use client";

// Metadata cannot be exported from client components
// This page requires client interactivity
import { useContext, useEffect, useMemo, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import MarketIndices from "@/components/dashboard/MarketIndices";
import GeneralContext from "@/context/GeneralContext";
import { useUser } from "@/context/UserContext";
import {
  api,
  type Holding,
  type Order,
  type PriceMap,
  type WatchlistEntry,
} from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useUser();
  if (!user) return null;
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [livePrices, setLivePrices] = useState<PriceMap>({});
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const { selectedStock, openBuyWindow, openSellWindow } =
    useContext(GeneralContext);

  const fetchData = async () => {
    try {
      const [holdingsRes, ordersRes, watchlistRes] = await Promise.all([
        api.getAllHoldings(),
        api.getAllOrders(),
        api.getWatchlist(),
      ]);
      setHoldings(holdingsRes);
      setOrders(ordersRes);
      setWatchlist(watchlistRes);
    } catch {
      // ignore errors; UI retains previous data
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

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchPrices = async () => {
      try {
        const data = await api.getAllPrices();
        setLivePrices((prev) => ({
          ...prev,
          ...data,
        }));
      } catch {
        // ignore price fetch errors; keep last known prices
      }
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
        const currentPrice = livePrices[h.name]?.price ?? h.price;
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
                      livePrices[selectedStock.symbol]?.price ??
                      selectedStock.price
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

        {/* Market Indices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            Market Indices
          </h3>
          <MarketIndices />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* P&L Summary */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
              P&L Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
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

              <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 md:p-5 border border-purple-200 dark:border-purple-800">
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

          {/* Watchlist Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                Watchlist
              </h3>
              <Link
                href="/dashboard/watchlist"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>

            {watchlist.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  No stocks in watchlist
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {watchlist.slice(0, 5).map((item) => {
                  const price =
                    livePrices[item.symbol]?.price ?? item.price ?? 0;
                  const prevClose =
                    livePrices[item.symbol]?.prevClose ?? item.prevClose ?? 0;
                  const changePct =
                    prevClose && price
                      ? ((price - prevClose) / prevClose) * 100
                      : 0;

                  return (
                    <div
                      key={item.symbol}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => openBuyWindow(item.symbol)}
                    >
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {item.symbol}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ₹{price.toFixed(2)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          changePct >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {changePct >= 0 ? "+" : ""}
                        {changePct.toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
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
                  ₹{user.funds.used.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Opening Balance
                </span>
                <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                  ₹
                  {(user.funds.available + user.funds.used).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
