import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ohlcRoutes from "./routes/ohlc.routes.js"
import authRoutes from "./routes/auth.routes.js";
import fundsRoutes from "./routes/funds.routes.js";
import ordersRoutes from "./routes/order.routes.js"
import readOnlyRoutes from "./routes/readOnly.routes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use("/auth", authRoutes);
app.use("/funds", fundsRoutes);
app.use("/orders", ordersRoutes);
// app.use("/holdings", holdingsRoutes);
// app.use("/prices", pricesRoutes);
app.use("/ohlc", ohlcRoutes);
app.use(readOnlyRoutes);

export default app;