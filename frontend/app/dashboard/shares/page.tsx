"use client";

import { useEffect, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import { api } from "@/lib/api";
import BuyActionWindow from "@/components/dashboard/BuyActionWindow";

// type MarketStock = {
//   symbol: string;
//   price: number;
// };

export default function MarketPage() {
  // const [stocks, setStocks] = useState<MarketStock[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeTrade, setActiveTrade] = useState<{
    symbol: string;
    mode: "BUY" | "SELL";
  } | null>(null);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    page: number;
    totalPages: number;
  } | null>(null);

  const fetchSymbols = async (pageNum: number) => {
    const res = await api.getMarketSymbols(pageNum, 10);
    setSymbols(res.data.map((s) => s.symbol));
    setMeta(res.meta);
  };

  useEffect(() => {
    fetchSymbols(page);
  }, [page]);

  const fetchPrices = async () => {
    const data = await api.getAllPrices();
    setPrices((prev) => ({ ...prev, ...data }));
  };

  const fetchWatchlist = async () => {
    const data = await api.getWatchlist();
    setWatchlist(data.map((w) => w.symbol));
  };

  const toggleWatchlist = async (symbol: string) => {
    if (watchlist.includes(symbol)) {
      await api.removeFromWatchlist(symbol);
    } else {
      await api.addToWatchlist(symbol);
    }

    // Update local state
    fetchWatchlist();

    // Notify other components (e.g., WatchList) to refresh immediately
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("watchlist-updated"));
    }
  };


  useEffect(() => {
    fetchPrices();
    fetchWatchlist();

    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Menu />

      {activeTrade && (
        <BuyActionWindow
          uid={activeTrade.symbol}
          mode={activeTrade.mode}
          onClose={() => setActiveTrade(null)}
        />
      )}

      <section className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Market</h2>

        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Symbol</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>

            {/* <tbody>
              {stocks.map((s) => (
                <tr key={s.symbol} className="border-t">
                  <td className="px-3 py-2 font-medium">{s.symbol}</td>

                  <td className="px-3 py-2">{s.price.toFixed(2)}</td>

                  <td className="px-3 py-2 flex justify-center items-center gap-2">
                    <button
                      onClick={() =>
                        setActiveTrade({ symbol: s.symbol, mode: "BUY" })
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() =>
                        setActiveTrade({ symbol: s.symbol, mode: "SELL" })
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                    >
                      Sell
                    </button>
                    <button
                      className="ml-2 px-3 py-1 text-lg text-yellow-500"
                      onClick={() => toggleWatchlist(s.symbol)}
                    >
                      {watchlist.includes(s.symbol) ? "★" : "☆"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}

            <tbody>
              {symbols.map((symbol) => (
                <tr key={symbol} className="border-t">
                  <td className="px-3 py-2 font-medium">{symbol}</td>

                  <td className="px-3 py-2">
                    {prices[symbol]?.toFixed(2) ?? "--"}
                  </td>

                  <td className="px-3 py-2 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setActiveTrade({ symbol, mode: "BUY" })}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      Buy
                    </button>

                    <button
                      onClick={() => setActiveTrade({ symbol, mode: "SELL" })}
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                    >
                      Sell
                    </button>

                    <button
                      className="ml-2 px-3 py-1 text-lg text-yellow-500"
                      onClick={() => toggleWatchlist(symbol)}
                    >
                      {watchlist.includes(symbol) ? "★" : "☆"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}
