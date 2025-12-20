import express from "express";
import { UserModel } from "../model/UserModel.js";
import { simulatedPrices } from "../services/market.service.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /watchlist
 */
router.get("/", authMiddleware, async (req, res) => {
  const user = await UserModel.findById(req.userId);

  const data = user.watchlist.map((symbol) => ({
    symbol,
    price: simulatedPrices[symbol] ?? null,
  }));

  res.json(data);
});

/**
 * POST /watchlist/add
 */
router.post("/add", authMiddleware, async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ message: "Symbol required" });
  }

  const upper = symbol.toUpperCase();

  const user = await UserModel.findById(req.userId);

  if (!user.watchlist.includes(upper)) {
    user.watchlist.push(upper);
    await user.save();
  }

  res.json({ watchlist: user.watchlist });
});

/**
 * DELETE /watchlist/remove
 */
router.delete("/remove", authMiddleware, async (req, res) => {
  const { symbol } = req.body;

  const user = await UserModel.findById(req.userId);
  user.watchlist = user.watchlist.filter((s) => s !== symbol.toUpperCase());
  await user.save();

  res.json({ watchlist: user.watchlist });
});

export default router;
