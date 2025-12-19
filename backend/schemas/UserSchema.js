import mongoose from "mongoose";

const { Schema } = mongoose;

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    funds: {
      available: {
        type: Number,
        default: 0, 
      },
      used: {
        type: Number,
        default: 0,
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


