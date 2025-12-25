import express from "express";
import {
  getMarketIndices,
  getMarketIndex,
} from "../services/indices.service.js";

const router = express.Router();

/**
 * GET /indices
 * Get all market indices (SENSEX, NIFTY)
 */
router.get("/", (req, res) => {
  const indices = getMarketIndices();
  res.json({
    data: indices,
    timestamp: new Date(),
  });
});

/**
 * GET /indices/:symbol
 * Get specific market index data
 */
router.get("/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const index = getMarketIndex(symbol);

  if (!index) {
    return res.status(404).json({ error: `Index ${symbol} not found` });
  }

  res.json({
    data: index,
    timestamp: new Date(),
  });
});

export default router;
