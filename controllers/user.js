import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SECRET;

import User from "../models/userModel.js";
import Point from "../models/pointModel.js";
import Wallet from "../models/walletModel.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    //If crednetials are valid, create a token for the user
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET,
      { expiresIn: "1h" }
    );

    //Then send the token to the client/frontend
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, name, bio } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exist" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${name}`,
      bio,
    });

    //Create a wallet for the user
    const mainWallet = await Wallet.create({
      userId: result._id,
      balance: 0,
      createdAt: new Date().toISOString(),
    });

    //Create a point walllet for the user
    const pointWallet = await Point.create({
      userId: result._id,
      balance: 0,
      createdAt: new Date().toISOString(),
    });

    console.log(result);
    const token = jwt.sign({ email: result.email, id: result._id }, SECRET, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ message: "User successfully created", result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
