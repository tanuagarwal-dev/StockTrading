"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import VerticalGraph from "../../../charts/VerticalGraph";
import Menu from "@/components/dashboard/Menu";

type Holding = {
  name: string;
  qty: number;
  avg: number;
  price: number;
  net: string;
  day: string;
  isLoss: boolean;
};

export default function Holdings() {
  const [allHoldings, setAllHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3002/allHoldings").then((res) => {
      setAllHoldings(res.data);
    });
  }, []);

  const labels = allHoldings.map((h) => h.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((h) => h.price),
        backgroundColor: "rgba(59,130,246,0.6)", // Tailwind blue
      },
    ],
  };

  return (
    <>
      <Menu />
      <section className="space-y-8 p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold">
          Holdings ({allHoldings.length})
        </h3>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Instrument</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Avg. cost</th>
                <th className="px-3 py-2">LTP</th>
                <th className="px-3 py-2">Cur. val</th>
                <th className="px-3 py-2">P&amp;L</th>
                <th className="px-3 py-2">Net chg.</th>
                <th className="px-3 py-2">Day chg.</th>
              </tr>
            </thead>

            <tbody>
              {allHoldings.map((stock, index) => {
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
                    <td className="px-3 py-2">{stock.name}</td>
                    <td className="px-3 py-2 text-center">{stock.qty}</td>
                    <td className="px-3 py-2">{stock.avg.toFixed(2)}</td>
                    <td className="px-3 py-2">{stock.price.toFixed(2)}</td>
                    <td className="px-3 py-2">{curValue.toFixed(2)}</td>
                    <td className={`px-3 py-2 ${profitClass}`}>
                      {pnl.toFixed(2)}
                    </td>
                    <td className={`px-3 py-2 ${profitClass}`}>{stock.net}</td>
                    <td className={`px-3 py-2 ${dayClass}`}>{stock.day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <h5 className="text-lg font-semibold">
              29,875.<span className="text-sm">55</span>
            </h5>
            <p className="text-sm text-gray-500">Total investment</p>
          </div>

          <div>
            <h5 className="text-lg font-semibold">
              31,428.<span className="text-sm">95</span>
            </h5>
            <p className="text-sm text-gray-500">Current value</p>
          </div>

          <div>
            <h5 className="text-lg font-semibold text-green-600">
              1,553.40 (+5.20%)
            </h5>
            <p className="text-sm text-gray-500">P&amp;L</p>
          </div>
        </div>

        {/* Graph */}
        <VerticalGraph data={data} />
      </section>
    </>
  );
}
