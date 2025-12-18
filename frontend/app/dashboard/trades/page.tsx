"use client";

import { useEffect, useMemo, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import apiClient from "@/lib/apiClient";
import CSVExport from "@/components/common/CSVExport";

type Trade = {
  _id: string;
  name: string;
  qty: number;
  mode: string;
  executedPrice?: number;
  realizedPnl?: number;
  createdAt?: string;
};

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    toDateInputValue(new Date())
  );

  const fetchTrades = () => {
    apiClient.get("/executedOrders").then((res) => {
      setTrades(res.data);
    });
  };

  useEffect(() => {
    fetchTrades();

    const handler = () => {
      fetchTrades();
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

  const tradesForDay = useMemo(() => {
    if (!selectedDate) return trades;
    const [y, m, d] = selectedDate.split("-").map((n) => Number(n));
    if (!y || !m || !d) return trades;
    return trades.filter((t) => {
      if (!t.createdAt) return false;
      const dt = new Date(t.createdAt);
      return (
        dt.getFullYear() === y &&
        dt.getMonth() + 1 === m &&
        dt.getDate() === d
      );
    });
  }, [trades, selectedDate]);

  const totalRealizedPnl = useMemo(
    () =>
      tradesForDay.reduce(
        (sum, t) => sum + (t.realizedPnl !== undefined ? t.realizedPnl : 0),
        0
      ),
    [tradesForDay]
  );

  const pnlClass =
    totalRealizedPnl > 0 ? "text-green-600" : totalRealizedPnl < 0 ? "text-red-600" : "";

  return (
    <>
      <Menu />
      <CSVExport
  data={trades}
  filename="trades.csv"
  headers={[
    { key: 'createdAt', label: 'Date' },
    { key: 'name', label: 'Symbol' },
    { key: 'mode', label: 'Side' },
    { key: 'qty', label: 'Quantity' },
    { key: 'executedPrice', label: 'Executed Price' },
    { key: 'realizedPnl', label: 'Realized P&L' },
  ]}
/>

      <section className="space-y-6 p-4">
        {/* Header / summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Trade Book</h3>
            <p className="text-xs text-gray-500">
              Executed orders only (delivery)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">
              Date:
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ml-2 border px-2 py-1 text-sm"
              />
            </label>

            <div className="text-sm">
              <span className="text-gray-600 mr-1">Total realized P&amp;L:</span>
              <span className={`font-semibold ${pnlClass}`}>
                {totalRealizedPnl.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Symbol</th>
                <th className="px-3 py-2">Side</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2">Executed price</th>
                <th className="px-3 py-2">Realized P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {tradesForDay.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-gray-500 text-sm"
                  >
                    No executed trades for this date.
                  </td>
                </tr>
              ) : (
                tradesForDay.map((trade) => {
                  const pnl = trade.realizedPnl ?? 0;
                  const rowPnlClass =
                    pnl > 0 ? "text-green-600" : pnl < 0 ? "text-red-600" : "";
                  return (
                    <tr key={trade._id} className="border-t">
                      <td className="px-3 py-2">
                        {formatDate(trade.createdAt)}
                      </td>
                      <td className="px-3 py-2">{trade.name}</td>
                      <td className="px-3 py-2">{trade.mode}</td>
                      <td className="px-3 py-2 text-center">{trade.qty}</td>
                      <td className="px-3 py-2">
                        {trade.executedPrice !== undefined
                          ? trade.executedPrice
                          : "-"}
                      </td>
                      <td className={`px-3 py-2 ${rowPnlClass}`}>
                        {pnl.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}


