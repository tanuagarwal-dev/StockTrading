import { OrdersModel } from "../model/OrdersModel.js";
import { UserModel } from "../model/UserModel.js";
import { HoldingsModel } from "../model/HoldingsModel.js";
import { executeOrder } from "../services/orderExecution.service.js";
import { getCurrentPriceForSymbol } from "../services/market.service.js";

export const placeOrder12 = async (req, res) => {
  try {
    const { name, qty, price, mode, orderType = "MARKET" } = req.body;

    const user = await UserModel.findById(req.userId);

    const result = await executeOrder({
      user,
      name,
      qty: Number(qty),
      side: mode,
      orderType,
      requestedPrice: orderType === "LIMIT" ? Number(price) : null,
    });

    const order = await OrdersModel.create({
      user: req.userId,
      name,
      qty,
      price: orderType === "LIMIT" ? price : null,
      mode,
      orderType,
      ...result,
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const oldNewOrder = async (req, res) => {
  try {
    const { name, qty, price, mode, orderType: rawOrderType } = req.body;

    // ---------- Basic validation ----------
    if (!name || !qty || !mode) {
      return res
        .status(400)
        .json({ message: "name, qty and mode are required" });
    }
    const orderType =
      rawOrderType === "LIMIT" || rawOrderType === "MARKET"
        ? rawOrderType
        : "MARKET";

    if (orderType === "LIMIT" && (!price || price <= 0)) {
      return res.status(400).json({ message: "Valid limit price required" });
    }
    const quantity = Number(qty);

    const requestedPrice = orderType === "LIMIT" ? Number(price) : null;

    if (orderType === "LIMIT") {
      if (!Number.isFinite(requestedPrice) || requestedPrice <= 0) {
        return res.status(400).json({ message: "Invalid limit price" });
      }
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // if (!Number.isFinite(requestedPrice) || requestedPrice <= 0) {
    //   return res.status(400).json({ message: "Invalid price" });
    // }

    const side = mode === "SELL" ? "SELL" : "BUY";

    const currentPrice = getCurrentPriceForSymbol(name);

    // ---------- Initial order state ----------
    let status = "REJECTED";
    let executedPrice = null;
    let realizedPnl = 0;
    let rejectionReason = "";

    // ---------- Decide execution ----------
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

    // ---------- Fetch user ----------
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ---------- Execute effects ----------
    if (status === "EXECUTED") {
      const execPrice = executedPrice;

      // ===== BUY =====
      if (side === "BUY") {
        const cost = execPrice * quantity;

        if (user.funds.available < cost) {
          status = "REJECTED";
          rejectionReason = "Insufficient funds";
        } else {
          // Deduct funds
          user.funds.available -= cost;
          user.funds.used += cost;
          await user.save();

          // Update holdings
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
            const newQty = holding.qty + quantity;
            holding.avg =
              (holding.avg * holding.qty + execPrice * quantity) / newQty;
            holding.qty = newQty;
            holding.price = execPrice;
          }

          await holding.save();
          realizedPnl = 0;
        }
      }

      // ===== SELL =====
      else {
        const holding = await HoldingsModel.findOne({
          user: req.userId,
          name,
        });

        if (!holding || holding.qty < quantity) {
          status = "REJECTED";
          rejectionReason = "Insufficient quantity to sell";
        } else {
          realizedPnl = (execPrice - holding.avg) * quantity;

          holding.qty -= quantity;

          if (holding.qty === 0) {
            await holding.deleteOne();
          } else {
            holding.price = execPrice;
            await holding.save();
          }

          // Credit funds
          const proceeds = execPrice * quantity;
          user.funds.available += proceeds;
          user.funds.used -= proceeds;
          await user.save();
        }
      }
    }

    // ---------- Persist order ----------
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
};

export const newOrder = async (req, res) => {
  try {
    const { name, qty, price, mode, orderType: rawOrderType } = req.body;

    const orderType =
      rawOrderType === "LIMIT" || rawOrderType === "MARKET"
        ? rawOrderType
        : "MARKET";

    if (!name || !qty || !mode) {
      return res
        .status(400)
        .json({ message: "name, qty and mode are required" });
    }

    const quantity = Number(qty);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const requestedPrice = orderType === "LIMIT" ? Number(price) : null;

    if (orderType === "LIMIT") {
      if (!Number.isFinite(requestedPrice) || requestedPrice <= 0) {
        return res.status(400).json({ message: "Valid limit price required" });
      }
    }

    const side = mode === "SELL" ? "SELL" : "BUY";
    const currentPrice = getCurrentPriceForSymbol(name);

    // ---------- Initial order state ----------
    let status = "REJECTED";
    let executedPrice = null;
    let realizedPnl = 0;
    let rejectionReason = "";

    // ---------- Decide execution ----------
    if (orderType === "MARKET") {
      status = "EXECUTED";
      executedPrice = currentPrice;
    } else {
      // LIMIT orders
      if (side === "BUY") {
        if (currentPrice <= requestedPrice) {
          status = "EXECUTED";
          executedPrice = currentPrice; // ✅ best available price
        } else {
          status = "REJECTED";
          rejectionReason = "Limit price not met";
        }
      }

      if (side === "SELL") {
        if (currentPrice >= requestedPrice) {
          status = "EXECUTED";
          executedPrice = currentPrice; // ✅ best available price
        } else {
          status = "REJECTED";
          rejectionReason = "Limit price not met";
        }
      }
    }

    // ---------- Fetch user ----------
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ---------- Execute effects ----------
    if (status === "EXECUTED") {
      const execPrice = executedPrice;

      // ===== BUY =====
      if (side === "BUY") {
        const cost = execPrice * quantity;

        if (user.funds.available < cost) {
          status = "REJECTED";
          rejectionReason = "Insufficient funds";
        } else {
          user.funds.available -= cost;
          user.funds.used += cost;
          await user.save();

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
            });
          } else {
            const newQty = holding.qty + quantity;
            holding.avg =
              (holding.avg * holding.qty + execPrice * quantity) / newQty;
            holding.qty = newQty;
            holding.price = execPrice;
          }

          await holding.save();
        }
      }

      // ===== SELL =====
      else {
        const holding = await HoldingsModel.findOne({
          user: req.userId,
          name,
        });

        if (!holding || holding.qty < quantity) {
          status = "REJECTED";
          rejectionReason = "Insufficient quantity to sell";
        } else {
          realizedPnl = (execPrice - holding.avg) * quantity;

          holding.qty -= quantity;

          if (holding.qty === 0) {
            await holding.deleteOne();
          } else {
            holding.price = execPrice;
            await holding.save();
          }

          // Correct fund release
          user.funds.available += execPrice * quantity;
          user.funds.used -= holding.avg * quantity;
          await user.save();
        }
      }
    }

    // ---------- Persist order ----------
    const orderDoc = new OrdersModel({
      user: req.userId,
      name,
      qty: quantity,
      price: requestedPrice, // null for MARKET
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
};



export const placeOrder = async (req, res) => {
  try {
    const { name, qty, price, mode, orderType = "MARKET" } = req.body;

    if (!name || !qty || !mode) {
      return res.status(400).json({ message: "name, qty, mode required" });
    }

    const quantity = Number(qty);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    if (orderType === "LIMIT" && (!price || price <= 0)) {
      return res.status(400).json({ message: "Invalid limit price" });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const result = await executeOrder({
      user,
      name,
      qty: quantity,
      side: mode,
      orderType,
      requestedPrice: orderType === "LIMIT" ? Number(price) : null,
    });

    const order = await OrdersModel.create({
      user: req.userId,
      name,
      qty: quantity,
      price: orderType === "LIMIT" ? Number(price) : null,
      mode,
      orderType,
      ...result,
    });

    res.json(order);
  } catch (err) {
    console.error("Place order error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};