"use client";
import { useEffect, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import { api, type Position, type PriceMap } from "@/lib/api";

export default function Positions() {
  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [livePrices, setLivePrices] = useState<PriceMap>({});

  useEffect(() => {
    api
      .getAllPositions()
      .then((res) => setAllPositions(res))
      .catch(() => {});
  }, []);

  // Poll live prices every 5s
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchPrices = async () => {
      try {
        const data = await api.getAllPrices();
        setLivePrices((prev) => ({ ...prev, ...data }));
      } catch {
        // ignore fetch errors
      }
    };

    fetchPrices();
    intervalId = setInterval(fetchPrices, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
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
                const lp = livePrices[stock.name];
                const currentPrice = lp?.price ?? stock.price;
                const prev = lp?.prevClose;
                const pct =
                  typeof prev === "number" && prev > 0
                    ? ((currentPrice - prev) / prev) * 100
                    : undefined;
                const curValue = currentPrice * stock.qty;
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
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-2">
                        <span>{currentPrice.toFixed(2)}</span>
                        {pct !== undefined && (
                          <span
                            className={
                              (pct ?? 0) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {(pct ?? 0) >= 0 ? (
                              <svg
                                className="inline w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 12.707a1 1 0 001.414 0L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="inline w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293A1 1 0 105.293 8.707l4 4a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {Math.abs(pct).toFixed(2)}%
                          </span>
                        )}
                      </span>
                    </td>
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
