import mongoose from "mongoose";

const walletSchema = mongoose.Schema({
  userId: { type: String, required: true },
  balance: { type: Number, required: true },
});

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
