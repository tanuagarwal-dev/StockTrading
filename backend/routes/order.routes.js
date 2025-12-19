import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { placeOrder } from "../controllers/order.controller.js";
import { newOrder, oldNewOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
// router.get("/", authMiddleware, getOrders);

// app.post("/newOrder", authMiddleware, async (req, res) => {
//   try {
//     const { name, qty, price, mode, orderType: rawOrderType } = req.body;
//     if (!name || !qty || !price || !mode) {
//       return res
//         .status(400)
//         .json({ message: "name, qty, price and mode are required" });
//     }
//     const user = await UserModel.findById(req.userId);
//     const cost = price * qty;

//     if (user.funds.available < cost) {
//       return res
//         .status(501)
//         .json({ message: "Insufficient funds" });
//     } else {
//       user.funds.available -= cost;
//       user.funds.used += cost;
//       await user.save();

//       const side = mode === "SELL" ? "SELL" : "BUY";
//       const orderType =
//         rawOrderType === "LIMIT" || rawOrderType === "MARKET"
//           ? rawOrderType
//           : "MARKET";

//       const quantity = Number(qty);
//       const requestedPrice = Number(price);

//       if (!Number.isFinite(quantity) || quantity <= 0) {
//         return res.status(400).json({ message: "Invalid quantity" });
//       }

//       if (!Number.isFinite(requestedPrice) || requestedPrice <= 0) {
//         return res.status(400).json({ message: "Invalid price" });
//       }

//       const currentPrice = getCurrentPriceForSymbol(name);

//       let status = "REJECTED";
//       let executedPrice = null;
//       let realizedPnl = 0;
//       let rejectionReason = "";
//       if (orderType === "MARKET") {
//         status = "EXECUTED";
//         executedPrice = currentPrice;
//       } else {
//         if (side === "BUY" && currentPrice <= requestedPrice) {
//           status = "EXECUTED";
//           executedPrice = requestedPrice;
//         } else if (side === "SELL" && currentPrice >= requestedPrice) {
//           status = "EXECUTED";
//           executedPrice = requestedPrice;
//         } else {
//           status = "REJECTED";
//           rejectionReason = "Limit price not met";
//         }
//       }

//       if (status === "EXECUTED") {
//         const execPrice = executedPrice;

//         if (side === "BUY") {
          
//           let holding = await HoldingsModel.findOne({
//             user: req.userId,
//             name,
//           });

//           if (!holding) {
//             holding = new HoldingsModel({
//               user: req.userId,
//               name,
//               qty: quantity,
//               avg: execPrice,
//               price: execPrice,
//               net: "0%",
//               day: "0%",
//             });
//           } else {
//             const existingQty = holding.qty ?? 0;
//             const existingAvg = holding.avg ?? execPrice;
//             const newQty = existingQty + quantity;
//             const newAvg =
//               (existingAvg * existingQty + execPrice * quantity) / newQty;

//             holding.qty = newQty;
//             holding.avg = newAvg;
//             holding.price = execPrice;
//           }

//           await holding.save();
//           realizedPnl = 0;
//         } else {
//           // SELL: reduce holding qty and compute realized P&L
//           const holding = await HoldingsModel.findOne({
//             user: req.userId,
//             name,
//           });

//           if (!holding || (holding.qty ?? 0) < quantity) {
//             status = "REJECTED";
//             rejectionReason = "Insufficient quantity to sell";
//           } else {
//             const existingQty = holding.qty;
//             const existingAvg = holding.avg ?? execPrice;

//             realizedPnl = (execPrice - existingAvg) * quantity;

//             const newQty = existingQty - quantity;

//             if (newQty > 0) {
//               holding.qty = newQty;
//               holding.price = execPrice;
//               await holding.save();
//             } else {
              
//               await holding.deleteOne();
//             }
//           }
//         }
//       }

//       const orderDoc = new OrdersModel({
//         user: req.userId,
//         name,
//         qty: quantity,
//         price: requestedPrice,
//         mode: side,
//         orderType,
//         status,
//         executedPrice,
//         realizedPnl,
//         rejectionReason,
//       });

//       await orderDoc.save();

//       return res.json(orderDoc);
//     }
//   } catch (err) {
//     console.error("New order error", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post("/newOrder1", authMiddleware, oldNewOrder);

// router.post("/newOrder", authMiddleware, newOrder);

export default router;
