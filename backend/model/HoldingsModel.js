import mongoose from "mongoose";
import { HoldingSchema } from "../schemas/HoldingSchema.js";

export const HoldingsModel = mongoose.model("holding", HoldingSchema);
