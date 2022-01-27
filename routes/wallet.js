import express from "express";
import {
  fundWallet,
  sendWallet,
  getWallet,
  getPoint,
  getTransactions,
} from "../controllers/wallet.js";

const router = express.Router();

//route to fund their own wallet
router.patch("/fund", fundWallet);

//route to send money from one user to another user
router.patch("/send", sendWallet);

//route to get wallet balance
router.get("/:id", getWallet);

//route for point balance
router.get("/point/:id", getPoint);

// route to get all wallet transactions
router.get("/transactions/:id", getTransactions);

export default router;
