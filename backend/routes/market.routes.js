import express from "express";
import {
  simulatedPrices,
  getAllSymbols,
  getPrice,
} from "../services/market.service.js";

const router = express.Router();

/**
 * GET /market/symbols
 */
router.get("/symbols", (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);

  const allSymbols = getAllSymbols();
  const total = allSymbols.length;

  const start = (page - 1) * limit;
  const end = start + limit;

  const data = allSymbols.slice(start, end).map((symbol) => ({
    symbol,
  }));

  res.json({
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * GET /market/prices
 */
router.get("/prices", (req, res) => {
  res.json(simulatedPrices);
});

/**
 * GET /market/price/:symbol
 */
router.get("/price/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const priceData = simulatedPrices[symbol];

  if (!priceData) {
    return res.status(404).json({ message: "Symbol not found" });
  }

  res.json({ symbol, price: priceData.price, prevClose: priceData.prevClose });
});

export default router;
