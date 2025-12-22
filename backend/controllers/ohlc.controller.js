import { ohlcBySymbol } from "../services/ohlc.service.js";
import { simulatedPrices } from "../services/market.service.js";

export const getOhlc = (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  if (!simulatedPrices[symbol]?.price) {
    return res.status(404).json({ message: "Symbol not found" });
  }

  res.json(ohlcBySymbol[symbol] || []);
};
