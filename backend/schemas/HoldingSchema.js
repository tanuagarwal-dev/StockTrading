import mongoose from "mongoose";

const { Schema } = mongoose;

export const HoldingSchema = new Schema({
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
});
