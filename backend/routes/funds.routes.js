import {
  addFunds,
  withdrawFunds,
  getTransactions,
} from "../controllers/funds.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/add", authMiddleware, addFunds);

router.post("/withdraw", authMiddleware, withdrawFunds);

router.get("/transactions", authMiddleware, getTransactions);

export default router;
