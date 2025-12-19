import express from "express";
import { getOhlc } from "../controllers/ohlc.controller.js";

const router = express.Router();

router.get("/:symbol", getOhlc);

export default router;
