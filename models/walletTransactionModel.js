import mongoose from "mongoose";

const walletTransactionSchema = mongoose.Schema({
  senderId: { type: String },
  receiverId: { type: String, required: true },
  amount: { type: Number, required: true },
});

const WalletTransaction = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);

export default WalletTransaction;
