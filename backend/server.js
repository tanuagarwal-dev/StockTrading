import dotenv from "dotenv";
import mongoose from "mongoose";
import app from './app.js';
dotenv.config();


const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URL;
if (!MONGO_URI) {
  console.log("Mongoose URL not defined in.env");
  process.exit(1);
}


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err);
    process.exit(1);
  });
