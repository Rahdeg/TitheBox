const { Transaction } = require("../models/transaction.model");
const Flutterwave = require("flutterwave-node-v3");
const User = require("../models/user.model").User;
const {verify_transaction} = require("../utils/functions");
require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB, process.env.FLUTTER_SEC);

exports.getTransactions = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    const transactions = await Transaction.find({
      user_id: req.params.id,
    }).sort({ createdAt: -1 });
    if (!user) {
      return res
        .status(404)
        .json({ msg: `User with id ${req.params.id} not found` });
    } else {
      return res.status(200).json(transactions);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured" });
  }
};

exports.getTransaction = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    const transaction = await Transaction.findById(req.params.tran_id);
    if (!user) {
      return res
        .status(404)
        .json({ msg: `User with id ${req.params.id} not found` });
    } else if (!transaction) {
      return res
        .status(404)
        .json({ msg: `Transaction with id ${req.params.tran_id} not found` });
    } else {
      return res.status(200).json(transaction);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured" });
  }
};

exports.getBanks = async function (req, res) {
  const country = req.query?.country;
  let banks = null;
  if (country) {
    const payload = { country: country };
    banks = await flw.Bank.country(payload);
    return res.status(200).json(banks.data);
  } else {
    const payload = { country: "NG" };
    banks = await flw.Bank.country(payload);
    return res.status(200).json(banks.data);
  }
};

exports.verifyTransaction = async function(req,res){
  try {
    const transaction = await Transaction.findById(req.params.tran_id);
    if (!transaction){
      return res.status(404).json({ msg: `Transaction with id ${req.params.tran_id} not found` });
    }else{
      
      const response = await verify_transaction(transaction);
      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured" });
  }

}