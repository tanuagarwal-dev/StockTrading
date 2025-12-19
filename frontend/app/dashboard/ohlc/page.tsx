"use client";

import { useEffect, useState } from "react";
import Menu from "@/components/dashboard/Menu";
import { api, type OHLCCandle } from "@/lib/api";
import CandleChart from "@/charts/CandleChart";

const symbols = ["INFY", "TCS", "RELIANCE", "HDFCBANK", "SBIN", "ITC"];

export default function OhlcPage() {
  const [symbol, setSymbol] = useState<string>(symbols[0]);
  const [candles, setCandles] = useState<OHLCCandle[]>([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchOhlc = async () => {
      try {
        const data = await api.getOHLC(symbol);
        setCandles(data);
      } catch {
        // ignore errors; chart will retain last candles
      }
    };

    fetchOhlc();
    intervalId = setInterval(fetchOhlc, 10000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [symbol]);

  return (
    <>
      <Menu />
      <section className="p-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">OHLC chart</h3>
            <p className="text-xs text-gray-500">
              1-minute simulated candles for a single symbol.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-600">
              Symbol:
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="ml-2 border px-2 py-1 text-sm bg-white"
              >
                {symbols.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="bg-white border rounded-md p-4">
          {candles.length === 0 ? (
            <p className="text-sm text-gray-500">
              Waiting for simulated candles...
            </p>
          ) : (
            <CandleChart candles={candles} />
          )}
        </div>
      </section>
    </>
  );
}
