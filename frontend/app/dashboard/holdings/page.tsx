"use client";

import { useContext, useEffect, useState } from "react";
import VerticalGraph from "../../../charts/VerticalGraph";
import Menu from "@/components/dashboard/Menu";
import { api, type Holding, type PriceMap } from "@/lib/api";
import CSVExport from "@/components/common/CSVExport";
import GeneralContext from "@/context/GeneralContext";

export default function Holdings() {
  const [allHoldings, setAllHoldings] = useState<Holding[]>([]);
  const [livePrices, setLivePrices] = useState<PriceMap>({});
  const { selectedStock, openBuyWindow, openSellWindow } =
    useContext(GeneralContext);

  const fetchHoldings = async () => {
    const data = await api.getAllHoldings();
    setAllHoldings(data);
  };

  useEffect(() => {
    fetchHoldings();

    const handler = () => {
      fetchHoldings();
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
        // swallow errors; UI will keep prior prices
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
      <CSVExport
        data={allHoldings}
        filename="holdings.csv"
        headers={[
          { key: "name", label: "Symbol" },
          { key: "qty", label: "Quantity" },
          { key: "avg", label: "Average Price" },
          { key: "price", label: "Current Price" },
        ]}
      />

      <section className="space-y-8 p-4">
        <h3 className="text-lg font-semibold">
          Holdings ({allHoldings.length})
        </h3>

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
                <th className="px-3 py-2">Sell</th>
                <th className="px-3 py-2">Buy More</th>
              </tr>
            </thead>

            <tbody>
              {allHoldings.map((stock, index) => {
                const currentPrice = livePrices[stock.name] ?? stock.price;
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
                    <td className="px-3 py-2">{stock.name}</td>
                    <td className="px-3 py-2 text-center">{stock.qty}</td>
                    <td className="px-3 py-2">{stock.avg.toFixed(2)}</td>
                    <td className="px-3 py-2">{currentPrice.toFixed(2)}</td>
                    <td className="px-3 py-2">{curValue.toFixed(2)}</td>
                    <td className={`px-3 py-2 ${profitClass}`}>
                      {pnl.toFixed(2)}
                    </td>
                    <td className={`px-3 py-2 ${profitClass}`}>{stock.net}</td>
                    <td className={`px-3 py-2 ${dayClass}`}>{stock.day}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => openSellWindow(stock.name)}
                        className="flex-1 sm:flex-none rounded-lg text-red-600 hover:text-red-700 font-semibold text-sm md:text-base transition duration-200 transform hover:scale-105"
                      >
                        SELL
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => openBuyWindow(stock.name)}
                        className="flex-1 sm:flex-none font-semibold rounded-lg text-green-600 hover:text-green-700 text-sm md:text-base shadow-lg transition duration-200 transform hover:scale-105"
                      >
                        BUY
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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

        <VerticalGraph data={data} />
      </section>
    </>
  );
}
