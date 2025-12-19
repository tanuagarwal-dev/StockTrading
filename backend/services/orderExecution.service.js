import { HoldingsModel } from "../model/HoldingsModel.js";
import { OrdersModel } from "../model/OrdersModel.js";
import { getCurrentPriceForSymbol } from "./market.service.js";

export const executeOrder12 = async ({
  user,
  name,
  qty,
  side,
  orderType,
  requestedPrice,
}) => {
  const currentPrice = getCurrentPriceForSymbol(name);

  let status = "REJECTED";
  let executedPrice = null;
  let realizedPnl = 0;
  let rejectionReason = "";

  if (orderType === "MARKET") {
    status = "EXECUTED";
    executedPrice = currentPrice;
  } else {
    if (
      (side === "BUY" && currentPrice <= requestedPrice) ||
      (side === "SELL" && currentPrice >= requestedPrice)
    ) {
      status = "EXECUTED";
      executedPrice = currentPrice;
    } else {
      rejectionReason = "Limit price not met";
    }
  }

  if (status !== "EXECUTED") {
    return { status, rejectionReason };
  }

  // BUY
  if (side === "BUY") {
    const cost = executedPrice * qty;
    if (user.funds.available < cost) {
      return { status: "REJECTED", rejectionReason: "Insufficient funds" };
    }

    user.funds.available -= cost;
    user.funds.used += cost;
    await user.save();

    let holding = await HoldingsModel.findOne({ user: user._id, name });

    if (!holding) {
      holding = new HoldingsModel({
        user: user._id,
        name,
        qty,
        avg: executedPrice,
        price: executedPrice,
      });
    } else {
      const newQty = holding.qty + qty;
      holding.avg = (holding.avg * holding.qty + executedPrice * qty) / newQty;
      holding.qty = newQty;
      holding.price = executedPrice;
    }

    await holding.save();
  }

  // SELL
  if (side === "SELL") {
    const holding = await HoldingsModel.findOne({ user: user._id, name });

    if (!holding || holding.qty < qty) {
      return { status: "REJECTED", rejectionReason: "Insufficient quantity" };
    }

    realizedPnl = (executedPrice - holding.avg) * qty;
    holding.qty -= qty;

    if (holding.qty === 0) await holding.deleteOne();
    else {
      holding.price = executedPrice;
      await holding.save();
    }

    user.funds.available += executedPrice * qty;
    user.funds.used -= holding.avg * qty;
    await user.save();
  }

  return { status, executedPrice, realizedPnl };
};


export const executeOrder = async ({
  user,
  name,
  qty,
  side,
  orderType,
  requestedPrice,
}) => {
  const currentPrice = getCurrentPriceForSymbol(name);

  let status = "REJECTED";
  let executedPrice = null;
  let realizedPnl = 0;
  let rejectionReason = "";

  // ---------- Decide execution ----------
  if (orderType === "MARKET") {
    status = "EXECUTED";
    executedPrice = currentPrice;
  } else {
    if (
      (side === "BUY" && currentPrice <= requestedPrice) ||
      (side === "SELL" && currentPrice >= requestedPrice)
    ) {
      status = "EXECUTED";
      executedPrice = currentPrice; // best price
    } else {
      rejectionReason = "Limit price not met";
      return { status, rejectionReason };
    }
  }

  // ---------- BUY ----------
  if (side === "BUY") {
    const cost = executedPrice * qty;
    if (user.funds.available < cost) {
      return { status: "REJECTED", rejectionReason: "Insufficient funds" };
    }

    user.funds.available -= cost;
    user.funds.used += cost;
    await user.save();

    let holding = await HoldingsModel.findOne({ user: user._id, name });

    if (!holding) {
      holding = new HoldingsModel({
        user: user._id,
        name,
        qty,
        avg: executedPrice,
        price: executedPrice,
      });
    } else {
      const newQty = holding.qty + qty;
      holding.avg =
        (holding.avg * holding.qty + executedPrice * qty) / newQty;
      holding.qty = newQty;
      holding.price = executedPrice;
    }

    await holding.save();
  }

  // ---------- SELL ----------
  if (side === "SELL") {
    const holding = await HoldingsModel.findOne({ user: user._id, name });

    if (!holding || holding.qty < qty) {
      return { status: "REJECTED", rejectionReason: "Insufficient quantity" };
    }

    realizedPnl = (executedPrice - holding.avg) * qty;
    holding.qty -= qty;

    if (holding.qty === 0) await holding.deleteOne();
    else {
      holding.price = executedPrice;
      await holding.save();
    }

    user.funds.available += executedPrice * qty;
    user.funds.used -= holding.avg * qty;
    await user.save();
  }

  return { status, executedPrice, realizedPnl };
};

