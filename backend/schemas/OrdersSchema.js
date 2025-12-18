import mongoose from "mongoose";

const { Schema } = mongoose;

export const OrdersSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    // Original requested price (for LIMIT) or client-specified price
    price: {
      type: Number,
      required: true,
    },
    // BUY or SELL
    mode: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    // MARKET or LIMIT
    orderType: {
      type: String,
      enum: ["MARKET", "LIMIT"],
      default: "MARKET",
    },
    // EXECUTED or REJECTED
    status: {
      type: String,
      enum: ["EXECUTED", "REJECTED"],
      required: true,
    },
    // Actual execution price when EXECUTED
    executedPrice: {
      type: Number,
    },
    // Realized P&L for this order (0 for BUY delivery)
    realizedPnl: {
      type: Number,
      default: 0,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
