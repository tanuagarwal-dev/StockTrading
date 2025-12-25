"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  lastUpdate: string;
}

export default function MarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await apiClient.get("/indices");
        setIndices(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching indices:", error);
        setLoading(false);
      }
    };

    fetchIndices();

    // Fetch indices every 5 seconds for live updates
    const interval = setInterval(fetchIndices, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {indices.map((index) => (
        <div
          key={index.symbol}
          className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {index.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {index.symbol}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                index.change >= 0
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}
            >
              {index.change >= 0 ? "+" : ""}
              {index.changePercent.toFixed(2)}%
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {index.value.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p
                className={`text-sm font-medium mt-1 ${
                  index.change >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {index.change >= 0 ? "+" : ""}
                {index.change.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">High</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {index.high.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {index.low.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Last updated: {new Date(index.lastUpdate).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}
