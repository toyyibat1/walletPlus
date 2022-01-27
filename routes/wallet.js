import express from "express";
import {
  fundWallet,
  sendWallet,
  getWallet,
  getPoint,
  getTransactions,
} from "../controllers/wallet.js";

const router = express.Router();

router.patch("/fund", fundWallet);

router.patch("/send", sendWallet);

router.get("/:id", getWallet);

router.get("/point/:id", getPoint);

router.get("/transactions/:id", getTransactions);

export default router;
