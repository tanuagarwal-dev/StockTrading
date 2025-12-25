import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ohlcRoutes from "./routes/ohlc.routes.js";
import authRoutes from "./routes/auth.routes.js";
import fundsRoutes from "./routes/funds.routes.js";
import ordersRoutes from "./routes/order.routes.js";
import readOnlyRoutes from "./routes/readOnly.routes.js";
import marketRoutes from "./routes/market.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import indicesRoutes from "./routes/indices.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Disable caching for price endpoints
app.use((req, res, next) => {
  if (req.path.includes("price") || req.path.includes("prices")) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
  }
  next();
});

app.use("/auth", authRoutes);
app.use("/funds", fundsRoutes);
app.use("/orders", ordersRoutes);
app.use("/market", marketRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/indices", indicesRoutes);
// app.use("/holdings", holdingsRoutes);
// app.use("/prices", pricesRoutes);
app.use("/ohlc", ohlcRoutes);
app.use(readOnlyRoutes);

export default app;
