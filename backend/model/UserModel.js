import mongoose from "mongoose";
import { UserSchema } from "../schemas/UserSchema.js";

export const UserModel = mongoose.model("user", UserSchema);


