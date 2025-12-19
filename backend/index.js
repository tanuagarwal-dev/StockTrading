import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HoldingsModel } from "./model/HoldingsModel.js";
import { OrdersModel } from "./model/OrdersModel.js";
import { PositionsModel } from "./model/PositionsModel.js";
import { UserModel } from "./model/UserModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
if (!MONGO_URI) {
  console.log("Mongoose URL not defined in.env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// --- Simple helpers ---
const getCurrentPriceForSymbol = (symbol) => {
  // Minimal simulated price feed; extend as needed.
  const prices = {
    INFY: 1555.45,
    ONGC: 116.8,
    TCS: 3194.8,
    KPITTECH: 266.45,
    "QUICKHEAL": 308.55,
    WIPRO: 577.75,
    "M&M": 779.8,
    RELIANCE: 2112.4,
    HUL: 512.4,
    BHARTIARTL: 541.15,
    HDFCBANK: 1522.35,
    HINDUNILVR: 2417.4,
    ITC: 207.9,
    SBIN: 430.2,
    SGBMAY29: 4719.0,
    TATAPOWER: 124.15,
  };

  return prices[symbol] ?? 100;
};

// --- In-memory simulated market prices (independent of execution logic) ---
const simulatedPrices = {
  INFY: 1555.45,
  TCS: 3194.8,
  RELIANCE: 2112.4,
  HDFCBANK: 1522.35,
  SBIN: 430.2,
  ITC: 207.9,
};

const updateSimulatedPrices = () => {
  Object.keys(simulatedPrices).forEach((symbol) => {
    const current = simulatedPrices[symbol];
    const delta = (Math.random() * 0.01 - 0.005) * current; // ±0.5%
    const next = current + delta;
    simulatedPrices[symbol] = Math.max(1, next);
  });
};

// update every 5 seconds
setInterval(updateSimulatedPrices, 5000);

// --- In-memory OHLC candles (1-minute, last 30 per symbol) ---
// Structure: { [symbol]: Array<{ timestamp, open, high, low, close }> }
const ohlcBySymbol = {};

const floorToMinute = (date) => {
  const d = new Date(date);
  d.setSeconds(0, 0);
  return d;
};

const updateOhlcFromPrices = () => {
  const now = new Date();
  const candleTime = floorToMinute(now);

  Object.keys(simulatedPrices).forEach((symbol) => {
    const price = simulatedPrices[symbol];
    if (price == null) return;

    if (!ohlcBySymbol[symbol]) {
      ohlcBySymbol[symbol] = [];
    }

    const candles = ohlcBySymbol[symbol];
    const lastCandle = candles[candles.length - 1];

    if (
      !lastCandle ||
      new Date(lastCandle.timestamp).getTime() !== candleTime.getTime()
    ) {
      // start new candle
      candles.push({
        timestamp: candleTime.toISOString(),
        open: price,
        high: price,
        low: price,
        close: price,
      });
      // keep only last 30
      if (candles.length > 30) {
        candles.shift();
      }
    } else {
      // update existing candle
      if (price > lastCandle.high) {
        lastCandle.high = price;
      }
      if (price < lastCandle.low) {
        lastCandle.low = price;
      }
      lastCandle.close = price;
    }
  });
};

// drive OHLC updates from current simulated prices every 5 seconds
setInterval(updateOhlcFromPrices, 5000);

// Simple auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Auth routes
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      funds: {
        available: 0,
        used: 0,
      },
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Register error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        funds: user.funds,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select(
      "name email funds role createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Me error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


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

app.get("/allHoldings", authMiddleware, async (req, res) => {
  const allHoldings = await HoldingsModel.find({ user: req.userId });
  res.json(allHoldings);
});

app.get("/allPositions", authMiddleware, async (req, res) => {
  const allPositions = await PositionsModel.find({ user: req.userId });
  res.json(allPositions);
});

app.get("/allOrders", authMiddleware, async (req, res) => {
  const allOrders = await OrdersModel.find({ user: req.userId });
  res.json(allOrders);
});

app.get("/executedOrders", authMiddleware, async (req, res) => {
  const executed = await OrdersModel.find({
    user: req.userId,
    status: "EXECUTED",
  })
    .sort({ createdAt: -1 });

  res.json(executed);
});

// Read-only price APIs
app.get("/prices", (req, res) => {
  res.json(simulatedPrices);
});

app.get("/price/:symbol", (req, res) => {
  const symbol = req.params.symbol;
  const upper = symbol.toUpperCase();
  const price = simulatedPrices[upper];

  if (price === undefined) {
    return res.status(404).json({ message: "Symbol not found" });
  }

  res.json({ symbol: upper, price });
});

// OHLC candles (1-minute, last 30 per symbol)
app.get("/ohlc/:symbol", (req, res) => {
  const symbol = req.params.symbol;
  const upper = symbol.toUpperCase();

  if (simulatedPrices[upper] === undefined) {
    return res.status(404).json({ message: "Symbol not found" });
  }

  const candles = ohlcBySymbol[upper] || [];
  res.json(candles);
});

app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    const { name, qty, price, mode, orderType: rawOrderType } = req.body;

    if (!name || !qty || !price || !mode) {
      return res
        .status(400)
        .json({ message: "name, qty, price and mode are required" });
    }

    const side = mode === "SELL" ? "SELL" : "BUY";
    const orderType =
      rawOrderType === "LIMIT" || rawOrderType === "MARKET"
        ? rawOrderType
        : "MARKET";

    const quantity = Number(qty);
    const requestedPrice = Number(price);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    if (!Number.isFinite(requestedPrice) || requestedPrice <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const currentPrice = getCurrentPriceForSymbol(name);

    let status = "REJECTED";
    let executedPrice = null;
    let realizedPnl = 0;
    let rejectionReason = "";

    // Decide execution price & status
    if (orderType === "MARKET") {
      status = "EXECUTED";
      executedPrice = currentPrice;
    } else {
      // LIMIT logic
      if (side === "BUY" && currentPrice <= requestedPrice) {
        status = "EXECUTED";
        executedPrice = requestedPrice;
      } else if (side === "SELL" && currentPrice >= requestedPrice) {
        status = "EXECUTED";
        executedPrice = requestedPrice;
      } else {
        status = "REJECTED";
        rejectionReason = "Limit price not met";
      }
    }

    // If EXECUTED, update holdings (delivery only)
    if (status === "EXECUTED") {
      const execPrice = executedPrice;

      if (side === "BUY") {
        // BUY: increase or create holding, recalc avg price
        let holding = await HoldingsModel.findOne({
          user: req.userId,
          name,
        });

        if (!holding) {
          holding = new HoldingsModel({
            user: req.userId,
            name,
            qty: quantity,
            avg: execPrice,
            price: execPrice,
            net: "0%",
            day: "0%",
          });
        } else {
          const existingQty = holding.qty ?? 0;
          const existingAvg = holding.avg ?? execPrice;
          const newQty = existingQty + quantity;
          const newAvg =
            (existingAvg * existingQty + execPrice * quantity) / newQty;

          holding.qty = newQty;
          holding.avg = newAvg;
          holding.price = execPrice;
        }

        await holding.save();
        realizedPnl = 0;
      } else {
        // SELL: reduce holding qty and compute realized P&L
        const holding = await HoldingsModel.findOne({
          user: req.userId,
          name,
        });

        if (!holding || (holding.qty ?? 0) < quantity) {
          status = "REJECTED";
          rejectionReason = "Insufficient quantity to sell";
        } else {
          const existingQty = holding.qty;
          const existingAvg = holding.avg ?? execPrice;

          realizedPnl = (execPrice - existingAvg) * quantity;

          const newQty = existingQty - quantity;

          if (newQty > 0) {
            holding.qty = newQty;
            holding.price = execPrice;
            await holding.save();
          } else {
            // no more quantity left, remove holding
            await holding.deleteOne();
          }
        }
      }
    }

    const orderDoc = new OrdersModel({
      user: req.userId,
      name,
      qty: quantity,
      price: requestedPrice,
      mode: side,
      orderType,
      status,
      executedPrice,
      realizedPnl,
      rejectionReason,
    });

    await orderDoc.save();

    return res.json(orderDoc);
  } catch (err) {
    console.error("New order error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err);
    process.exit(1);
  });
