"use client";

import { useState, useContext, useEffect } from "react";
import GeneralContext from "@/context/GeneralContext";
import { DoughnutChart } from "../../charts/DoughnutChart";
import { api, type PriceMap, type WatchlistEntry } from "@/lib/api";

function WatchListItem({ symbol, price }: { symbol: string; price: number }) {
  const [showActions, setShowActions] = useState(false);
  const generalContext = useContext(GeneralContext);

  return (
    // <li
    //   onMouseEnter={() => setShowActions(true)}
    //   onMouseLeave={() => setShowActions(false)}
    //   onClick={() =>
    //     generalContext.setSelectedStock({ symbol, price })
    //   }
    //   className="relative rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:shadow-md"
    // >
    //   <div className="flex justify-between items-center">
    //     <p
    //       className={`text-sm font-semibold ${
    //         stock.isDown
    //           ? "text-red-600 dark:text-red-400"
    //           : "text-green-600 dark:text-green-400"
    //       }`}
    //     >
    //       {stock.name}
    //     </p>

    //     <div className="flex items-center gap-2 text-xs">
    //       <span
    //         className={`font-medium ${
    //           stock.isDown
    //             ? "text-red-600 dark:text-red-400"
    //             : "text-green-600 dark:text-green-400"
    //         }`}
    //       >
    //         {stock.percent}
    //       </span>
    //       {stock.isDown ? (
    //         <svg
    //           className="w-4 h-4 text-red-600 dark:text-red-400"
    //           fill="currentColor"
    //           viewBox="0 0 20 20"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
    //             clipRule="evenodd"
    //           />
    //         </svg>
    //       ) : (
    //         <svg
    //           className="w-4 h-4 text-green-600 dark:text-green-400"
    //           fill="currentColor"
    //           viewBox="0 0 20 20"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
    //             clipRule="evenodd"
    //           />
    //         </svg>
    //       )}
    //       <span className="font-bold text-gray-900 dark:text-white">
    //         ₹{price.toFixed(2)}
    //       </span>
    //     </div>
    //   </div>

    //   {showActions && <WatchListActions uid={stock.name} />}
    // </li>

    <li
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => generalContext.setSelectedStock({ symbol, price })}
      className="relative rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all"
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {symbol}
        </p>

        <span className="font-bold text-gray-900 dark:text-white">
          ₹{price.toFixed(2)}
        </span>
      </div>

      {showActions && <WatchListActions uid={symbol} />}
    </li>
  );
}

function WatchListActions({ uid }: { uid: string }) {
  const generalContext = useContext(GeneralContext);

  return (
    <div className="absolute right-0 top-full mt-2 flex gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-2 shadow-lg z-10">
      <button
        onClick={() => generalContext.openBuyWindow(uid)}
        title="Buy (B)"
        className="rounded-md bg-green-600 hover:bg-green-700 px-3 py-1.5 text-xs font-semibold text-white transition shadow-sm"
      >
        Buy
      </button>

      <button
        onClick={() => generalContext.openSellWindow(uid)}
        title="Sell (S)"
        className="rounded-md bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-semibold text-white transition shadow-sm"
      >
        Sell
      </button>

      <button
        title="Analytics (A)"
        type="button"
        className="rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      </button>

      <button
        type="button"
        title="More"
        className="rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
    </div>
  );
}

export default function WatchList() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [prices, setPrices] = useState<PriceMap>({});

  // const [prices, setPrices] = useState<PriceMap>(() => {
  //   const initial: PriceMap = {};
  //   watchlist.forEach((s) => {
  //     initial[s.name] = s.price;
  //   });
  //   return initial;
  // });

  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout | null = null;

  //   const fetchPrices = async () => {
  //     try {
  //       const data = await api.getAllPrices();
  //       setPrices((prev) => ({
  //         ...prev,
  //         ...data,
  //       }));
  //     } catch {
  //       // silently fail; UI retains previous prices
  //     }
  //   };

  //   fetchPrices();
  //   intervalId = setInterval(fetchPrices, 5000);

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, []);

  // Initial fetch + refresh when other components update the watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      const data = await api.getWatchlist();
      setWatchlist(data);
    };

    fetchWatchlist();

    const handler = () => fetchWatchlist();
    window.addEventListener("watchlist-updated", handler);

    return () => {
      window.removeEventListener("watchlist-updated", handler);
    };
  }, []);

  // 🔹 Fetch prices repeatedly
  useEffect(() => {
    const fetchPrices = async () => {
      const data = await api.getAllPrices();
      setPrices(data);
    };

    fetchPrices();
    const id = setInterval(fetchPrices, 5000);
    return () => clearInterval(id);
  }, []);

  const symbols = watchlist.map((w) => w.symbol);

  const chartData = {
    labels: symbols,
    datasets: [
      {
        data: symbols.map((s) => prices[s] ?? 0),
        backgroundColor: [
          "#60a5fa",
          "#34d399",
          "#facc15",
          "#a78bfa",
          "#fb923c",
        ],
      },
    ],
  };

  // const labels = watchlist.map((s) => s.name);

  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "Price",
  //       data: watchlist.map((s) => prices[s.name] ?? s.price),
  //       backgroundColor: [
  //         "#f87171",
  //         "#60a5fa",
  //         "#facc15",
  //         "#34d399",
  //         "#a78bfa",
  //         "#fb923c",
  //       ],
  //     },
  //   ],
  // };

  return (
    // <aside className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
    //   <div className="space-y-2">
    //     <input
    //       type="text"
    //       placeholder="Search eg: infy, bse, nifty fut"
    //       className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition shadow-sm"
    //     />
    //     <div className="flex items-center justify-between">
    //       <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
    //         Watchlist
    //       </span>
    //       <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
    //         {watchlist.length} / 50
    //       </span>
    //     </div>
    //   </div>

    //   <ul className="space-y-2">
    //     {watchlist.map((stock) => (
    //       <WatchListItem
    //         key={stock.name}
    //         stock={stock}
    //         price={prices[stock.name] ?? stock.price}
    //       />
    //     ))}
    //   </ul>

    //   <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    //     <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
    //       Portfolio Distribution
    //     </h4>
    //     <DoughnutChart data={data} />
    //   </div>
    // </aside>

    <aside className="p-4 space-y-6 overflow-y-auto">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Watchlist</span>
        <span>{watchlist.length} / 50</span>
      </div>

      <ul className="space-y-2">
        {watchlist.map((w) => (
          <WatchListItem
            key={w.symbol}
            symbol={w.symbol}
            price={prices[w.symbol] ?? 0}
          />
        ))}
      </ul>

      {watchlist.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border">
          <h4 className="text-sm font-semibold mb-3">Price Distribution</h4>
          <DoughnutChart data={chartData} />
        </div>
      )}
    </aside>
  );
}
