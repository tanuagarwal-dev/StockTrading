import mongoose from "mongoose";

const { Schema } = mongoose;

export const OrdersSchema = new Schema({
  name: String,
  qty: Number,
  price: Number,
  mode: String,
});
