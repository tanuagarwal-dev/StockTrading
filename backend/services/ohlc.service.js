import { simulatedPrices } from "./market.service.js";

export const ohlcBySymbol = {};

const floorToMinute = (date) => {
  const d = new Date(date);
  d.setSeconds(0, 0);
  return d;
};

export const updateOhlcFromPrices = () => {
  const now = new Date();
  const candleTime = floorToMinute(now);

  Object.keys(simulatedPrices).forEach((symbol) => {
    const price = simulatedPrices[symbol].price;
    if (!price) return;

    if (!ohlcBySymbol[symbol]) {
      ohlcBySymbol[symbol] = [];
    }

    const candles = ohlcBySymbol[symbol];
    const last = candles[candles.length - 1];

    if (!last || new Date(last.timestamp).getTime() !== candleTime.getTime()) {
      candles.push({
        timestamp: candleTime.toISOString(),
        open: price,
        high: price,
        low: price,
        close: price,
      });

      if (candles.length > 30) candles.shift();
    } else {
      last.high = Math.max(last.high, price);
      last.low = Math.min(last.low, price);
      last.close = price;
    }
  });
};

// run once globally
setInterval(updateOhlcFromPrices, 5000);
