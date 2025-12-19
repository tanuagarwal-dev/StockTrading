
import express from 'express';
import { OrdersModel } from "../model/OrdersModel.js";
import { simulatedPrices } from "../services/market.service.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { HoldingsModel } from '../model/HoldingsModel.js';
import {PositionsModel} from "../model/PositionsModel.js"


const router = express.Router();


// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "TBT",
//       name: "YOYO",
//       qty: 3,
//       avg: 376.27,
//       price: 389.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: false,
//     },
//     {
//       product: "YT",
//       name: "BURGERS",
//       qty: 1,
//       avg: 1124.75,
//       price: 1082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: false,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

// Protected portfolio & order routes


router.get("/allHoldings", authMiddleware, async (req, res) => {
  const allHoldings = await HoldingsModel.find({ user: req.userId });
  res.json(allHoldings);
});

router.get("/allPositions", authMiddleware, async (req, res) => {
  const allPositions = await PositionsModel.find({ user: req.userId });
  res.json(allPositions);
});

router.get("/allOrders", authMiddleware, async (req, res) => {
  const allOrders = await OrdersModel.find({ user: req.userId });
  res.json(allOrders);
});

router.get("/orders", authMiddleware, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const status = req.query.status; // optional

  const query = { user: req.userId };
  if (status) query.status = status;

  const total = await OrdersModel.countDocuments(query);

  const orders = await OrdersModel.find(query)
    .sort({ createdAt: -1 }) // newest first
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    data: orders,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

router.get("/allExecutedOrders", authMiddleware, async (req, res) => {
  const executed = await OrdersModel.find({
    user: req.userId,
    status: "EXECUTED",
  }).sort({ createdAt: -1 });

  res.json(executed);
});

router.get("/executedOrders", authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);

    const query = { user: req.userId, status: "EXECUTED" };

    const total = await OrdersModel.countDocuments(query);

    const orders = await OrdersModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Executed orders error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/prices", (req, res) => {
  res.json(simulatedPrices);
});

router.get("/price/:symbol", (req, res) => {
  const symbol = req.params.symbol;
  const upper = symbol.toUpperCase();
  const price = simulatedPrices[upper];

  if (price === undefined) {
    return res.status(404).json({ message: "Symbol not found" });
  }

  res.json({ symbol: upper, price });
});

export default router