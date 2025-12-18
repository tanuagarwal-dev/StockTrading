import mongoose from "mongoose";
import { OrdersSchema } from "../schemas/OrdersSchema.js";

export const OrdersModel = mongoose.model("order", OrdersSchema);
