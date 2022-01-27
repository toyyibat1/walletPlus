import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js";
import walletRoutes from "./routes/wallet.js";

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/wallet", walletRoutes);
// app.use("/", walletTransactionRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 6000;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
