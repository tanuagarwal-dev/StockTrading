"use client";

import { useState, useContext, useEffect } from "react";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import GeneralContext from "@/context/GeneralContext";
import { watchlist } from "../../lib/dashboardData";
import { DoughnutChart } from "../../charts/DoughnutChart";
import apiClient from "@/lib/apiClient";


function WatchListItem({ stock, price }: any) {
  const [showActions, setShowActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="relative rounded-md px-2 py-1 hover:bg-gray-50"
    >
      <div className="flex justify-between items-center">
        <p
          className={`text-sm font-medium ${
            stock.isDown ? "text-red-600" : "text-green-600"
          }`}
        >
          {stock.name}
        </p>

        <div className="flex items-center gap-1 text-sm">
          <span>{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="text-red-600" fontSize="small" />
          ) : (
            <KeyboardArrowUp className="text-green-600" fontSize="small" />
          )}
          <span>{price.toFixed(2)}</span>
        </div>
      </div>

      {showActions && <WatchListActions uid={stock.name} />}
    </li>
  );
}


function WatchListActions({ uid }: { uid: string }) {
  const generalContext = useContext(GeneralContext);

  return (
    <div className="absolute right-0 top-full mt-1 flex gap-1 bg-white border rounded-md p-1 shadow-sm z-10">
      <Tooltip title="Buy (B)" arrow TransitionComponent={Grow}>
        <button
          onClick={() => generalContext.openBuyWindow(uid)}
          className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
        >
          Buy
        </button>
      </Tooltip>

      <Tooltip title="Sell (S)" arrow TransitionComponent={Grow}>
        <button
          onClick={() => generalContext.openSellWindow(uid)}
          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
        >
          Sell
        </button>
      </Tooltip>

      <Tooltip title="Analytics (A)" arrow TransitionComponent={Grow}>
        <button
          title="Analytics"
          type="button"
          className="rounded p-1 hover:bg-gray-100"
        >
          <BarChartOutlined fontSize="small" />
        </button>
      </Tooltip>

      <Tooltip title="More" arrow TransitionComponent={Grow}>
        <button type="button" title="more" className="rounded p-1 hover:bg-gray-100">
          <MoreHoriz fontSize="small" />
        </button>
      </Tooltip>
    </div>
  );
}

export default function WatchList() {
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    watchlist.forEach((s) => {
      initial[s.name] = s.price;
    });
    return initial;
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchPrices = () => {
      apiClient
        .get("/prices")
        .then((res) => {
          const data = res.data as Record<string, number>;
          setPrices((prev) => ({
            ...prev,
            ...data,
          }));
        })
        .catch(() => {
          // ignore errors for now
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

  const labels = watchlist.map((s) => s.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((s) => prices[s.name] ?? s.price),
        backgroundColor: [
          "#f87171",
          "#60a5fa",
          "#facc15",
          "#34d399",
          "#a78bfa",
          "#fb923c",
        ],
      },
    ],
  };

  return (
    <aside className="w-80 border-r bg-white p-4 space-y-6">
      {/* Search */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search eg: infy, bse, nifty fut"
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-500">
          {watchlist.length} / 50
        </span>
      </div>

      {/* Watchlist */}
      <ul className="space-y-1">
        {watchlist.map((stock) => (
          <WatchListItem
            key={stock.name}
            stock={stock}
            price={prices[stock.name] ?? stock.price}
          />
        ))}
      </ul>

      {/* Chart */}
      <DoughnutChart data={data} />
    </aside>
  );
}
