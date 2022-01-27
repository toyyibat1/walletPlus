import express from "express";
import mongoose from "mongoose";

import WalletModel from "../models/walletModel.js";
import PointModel from "../models/pointModel.js";
import WalletTransactionModel from "../models/walletTransactionModel.js";

const router = express.Router();

//function to add to wallet
const addWallet = async (userId, amount) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return false;
  const wallet = await WalletModel.findOne({ userId });
  if (!wallet) return false;
  const newAmount = wallet.balance + amount;
  await WalletModel.updateOne({ userId }, { balance: newAmount });
  return true;
};


//function to deduct from balance
const deductWallet = async (userId, amount) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return false;
  const wallet = await WalletModel.findOne({ userId });
  if (!wallet) return false;
  const newAmount = wallet.balance - amount;
  await WalletModel.updateOne({ userId }, { balance: newAmount });
  return true;
};

// function to add transaction record
const addWalletTransaction = async (senderId, receiverId, amount) => {
  // if (!mongoose.Types.ObjectId.isValid(senderId)) return false;
  if (!mongoose.Types.ObjectId.isValid(receiverId)) return false;
  const walletTransaction = await WalletTransactionModel.create({
    senderId,
    receiverId,
    amount,
    createdAt: new Date().toISOString(),
  });
  return walletTransaction;
};

// function to calculate and add point
const addPoint = async (userId, amount) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return false;
  const point = await PointModel.findOne({ userId });
  if (!point) return false;

  let oldPoint = point.balance;

  if (amount >= 5000) {
    let newPoint;
    //if between $5,000 and $10,000 add 1% of amount to point
    if (amount >= 5000 && amount <= 10000) {
      newPoint = oldPoint + amount * 0.01;
    }

    //if between $10,001 to $25,000 add 2.5% of amount to point
    else if (amount >= 10001 && amount <= 25000) {
      newPoint = oldPoint + amount * 0.025;
    }

    //if $25,0001 and above add 5% of amount to point to a max of 5000
    else if (amount >= 25001) {
      let extra = amount * 0.05;
      if (extra > 5000) {
        // if more than 5000 points, set to 5000
        newPoint = oldPoint + 5000;
      } else {
        newPoint = oldPoint + extra;
      }
    }

    await PointModel.updateOne({ userId }, { balance: newPoint });
    return true;
  } else return false;
};
export const fundWallet = async (req, res) => {
  // user fund wallet
  const { receiverId, amount } = req.body;

  //check receiver wallet
  const receiverWallet = await WalletModel.findOne({ userId: receiverId });
  if (!receiverWallet)
    return res.status(400).json({ message: "Receiver wallet not found" });

  //add receiver wallet balance
  const addWalletBal = await addWallet(receiverId, amount);

  //add wallet transaction
  const addWalletTransactionRecord = await addWalletTransaction(
    "",
    receiverId,
    amount
  ); //senderId = 0 means it is a fund wallet transaction

  //add point
  const addPointBal = await addPoint(receiverId, amount);

  return res.status(200).json({ message: "Success" });
};

export const sendWallet = async (req, res) => {
  //sending from user to another user

  const { senderId, receiverId, amount } = req.body;

  //check sender wallet balance
  const senderWallet = await WalletModel.findOne({ userId: senderId });
  if (!senderWallet)
    return res.status(400).json({ message: "Sender wallet not found" });
  if (senderWallet.balance < amount)
    return res.status(400).json({ message: "Insufficient balance" });

  //check receiver wallet
  const receiverWallet = await WalletModel.findOne({ userId: receiverId });
  if (!receiverWallet)
    return res.status(400).json({ message: "Receiver wallet not found" });

  //deduct sender wallet balance
  const deductWalletResult = await deductWallet(senderId, amount);
  if (!deductWalletResult)
    return res
      .status(400)
      .json({ message: "Failed to deduct sender wallet balance" });

  //add receiver wallet balance
  const addWalletBal = await addWallet(receiverId, amount);

  //add wallet transaction
  const addWalletTransactionRecord = await addWalletTransaction(
    senderId,
    receiverId,
    amount
  );

  return res.status(200).json({ message: "Success" });
};

export const getWallet = async (req, res) => {
  // get wallet balance
  const { id: _id } = req.params;
  const wallet = await WalletModel.findOne({ userId: _id });
  if (!wallet) return res.status(400).json({ message: "Wallet not found" });
  return res.status(200).json({ balance: wallet.balance });
};

export const getPoint = async (req, res) => {
  // get point balance
  const { id: _id } = req.params;
  const point = await PointModel.findOne({ userId: _id });
  if (!point) return res.status(400).json({ message: "Point not found" });
  return res.status(200).json({ balance: point.balance });
};

export const getTransactions = async (req, res) => {
  // get all transactions
  const { id: _id } = req.params;
  const transactions = await WalletTransactionModel.find({
    $or: [{ senderId: _id }, { receiverId: _id }],
  });
  if (!transactions)
    return res.status(400).json({ message: "No transactions found" });
  return res.status(200).json({ transactions });
};
