"use client";

import { useEffect, useState } from "react";
import {
  api,
  type WatchlistEntry,
  type PriceMap,
  type OHLCCandle,
} from "@/lib/api";
import { LineChart } from "@/charts/LineChart";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [prices, setPrices] = useState<PriceMap>({});
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [ohlcData, setOhlcData] = useState<OHLCCandle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const data = await api.getWatchlist();
      setWatchlist(data);
      if (data.length > 0 && !selectedSymbol) {
        setSelectedSymbol(data[0].symbol);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrices = async () => {
    try {
      const data = await api.getAllPrices();
      setPrices((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const fetchOHLC = async (symbol: string) => {
    try {
      const data = await api.getOHLC(symbol);
      setOhlcData(data);
    } catch (error) {
      console.error("Error fetching OHLC:", error);
    }
  };

  useEffect(() => {
    fetchWatchlist();
    fetchPrices();

    const priceInterval = setInterval(fetchPrices, 5000);

    const handler = () => {
      fetchWatchlist();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("watchlist-updated", handler);
    }

    return () => {
      clearInterval(priceInterval);
      if (typeof window !== "undefined") {
        window.removeEventListener("watchlist-updated", handler);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedSymbol) {
      fetchOHLC(selectedSymbol);
      const interval = setInterval(() => fetchOHLC(selectedSymbol), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedSymbol]);

  const removeFromWatchlist = async (symbol: string) => {
    try {
      await api.removeFromWatchlist(symbol);
      fetchWatchlist();
      if (selectedSymbol === symbol && watchlist.length > 1) {
        const remaining = watchlist.filter((w) => w.symbol !== symbol);
        setSelectedSymbol(remaining[0]?.symbol || null);
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            No stocks in watchlist
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add stocks to your watchlist from the Market page
          </p>
        </div>
      </div>
    );
  }

  const selectedStock = watchlist.find((w) => w.symbol === selectedSymbol);
  const currentPrice = selectedSymbol
    ? prices[selectedSymbol]?.price ?? selectedStock?.price ?? 0
    : 0;
  const prevClose = selectedSymbol
    ? prices[selectedSymbol]?.prevClose ?? selectedStock?.prevClose ?? 0
    : 0;
  const changePct =
    prevClose && currentPrice
      ? ((currentPrice - prevClose) / prevClose) * 100
      : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Watchlist</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist Items */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold">
                My Watchlist ({watchlist.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {watchlist.map((item) => {
                const price = prices[item.symbol]?.price ?? item.price ?? 0;
                const pc =
                  prices[item.symbol]?.prevClose ?? item.prevClose ?? 0;
                const change = pc && price ? ((price - pc) / pc) * 100 : 0;
                const isActive = selectedSymbol === item.symbol;

                return (
                  <div
                    key={item.symbol}
                    onClick={() => setSelectedSymbol(item.symbol)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.symbol}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            change >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(2)}%
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchlist(item.symbol);
                          }}
                          title="Remove from watchlist"
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        >
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
          {selectedSymbol ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedSymbol}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{currentPrice.toFixed(2)}
                  </span>
                  <span
                    className={`text-lg font-medium ${
                      changePct >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {changePct >= 0 ? "+" : ""}
                    {changePct.toFixed(2)}%
                  </span>
                </div>
              </div>

              {ohlcData.length > 0 ? (
                <div className="h-96">
                  <LineChart
                    data={{
                      labels: ohlcData.map((candle) =>
                        new Date(candle.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      ),
                      datasets: [
                        {
                          label: selectedSymbol,
                          data: ohlcData.map((candle) => candle.close),
                          borderColor:
                            changePct >= 0
                              ? "rgb(34, 197, 94)"
                              : "rgb(239, 68, 68)",
                          backgroundColor:
                            changePct >= 0
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(239, 68, 68, 0.1)",
                          fill: true,
                          tension: 0.4,
                          pointRadius: 0,
                          pointHoverRadius: 6,
                          borderWidth: 2,
                        },
                      ],
                    }}
                  />
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 h-96 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select a stock to view chart
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
