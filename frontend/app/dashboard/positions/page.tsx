"use client";
import { useEffect, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import apiClient from "@/lib/apiClient";

type Position = {
  product: string;
  name: string;
  qty: number;
  avg: number;
  price: number;
  day: string;
  isLoss: boolean;
};

export default function Positions() {
  const [allPositions, setAllPositions] = useState<Position[]>([]);

  useEffect(() => {
    apiClient.get("/allPositions").then((res) => {
      setAllPositions(res.data);
    });
  }, []);

  const labels = allPositions.map((h) => h.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allPositions.map((h) => h.price),
        backgroundColor: "rgba(59,130,246,0.6)", // Tailwind blue
      },
    ],
  };
  return (
    <>
      <Menu />
      <section className="space-y-6 p-4">
        <h3 className="text-lg font-semibold">
          Positions ({allPositions.length})
        </h3>

        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Product</th>
                <th className="px-3 py-2 text-left">Instrument</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2">Avg</th>
                <th className="px-3 py-2">LTP</th>
                <th className="px-3 py-2">P&amp;L</th>
                <th className="px-3 py-2">Chg.</th>
              </tr>
            </thead>

            <tbody>
              {allPositions.map((stock: Position, index: number) => {
                const curValue = stock.price * stock.qty;
                const pnl = curValue - stock.avg * stock.qty;
                const isProfit = pnl >= 0;
                const profitClass = isProfit
                  ? "text-green-600"
                  : "text-red-600";
                const dayClass = stock.isLoss
                  ? "text-red-600"
                  : "text-green-600";

                return (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-2">{stock.product}</td>
                    <td className="px-3 py-2">{stock.name}</td>
                    <td className="px-3 py-2 text-center">{stock.qty}</td>
                    <td className="px-3 py-2">{stock.avg.toFixed(2)}</td>
                    <td className="px-3 py-2">{stock.price.toFixed(2)}</td>
                    <td className={`px-3 py-2 ${profitClass}`}>
                      {pnl.toFixed(2)}
                    </td>
                    <td className={`px-3 py-2 ${dayClass}`}>{stock.day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
