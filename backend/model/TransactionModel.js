import mongoose from "mongoose";
import { TransactionSchema } from "../schemas/TransactionSchema.js";

export const TransactionModel = mongoose.model(
  "Transaction",
  TransactionSchema
);
