const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Flutterwave = require("flutterwave-node-v3");
const User = require("../models/user.model").User;
const { Income } = require("../models/income.model");
const { Church } = require("../models/church.model");
const {SubAccount}= require("../models/subAccount.model")
const {Transaction} = require("../models/transaction.model");
const {
  sendCode,
  generateCode,
  senddetails,
  filterOutPasswordField,
  createSubAccount,
  updateSubaccount,
} = require("../utils/functions");
require("dotenv").config();
const salt = parseInt(process.env.SALT);
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const flw = new Flutterwave(process.env.FLUTTER_PUB, process.env.FLUTTER_SEC);

exports.signUp = async function (req, res) {
  try {
    const data = req.body;
    const email_exists = await User.findOne({ email: data.email });
    if (email_exists) {
      return res.status(400).json({ msg: "email already exists" });
    }
    bcrypt.hash(data.password, salt, (err, hash) => {
      if (err) {
        return res.status(500).json({ msg: err });
      }
      if (hash) {
        data.password = hash;
      }
      const user = new User(data);
      user.token = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET);
      user.save((error, user) => {
        if (error) {
          console.log(error)
          return res.status(400).json({ msg: "User Not Saved" });
        } else if (user) {
          senddetails(data);
          return res.status(201).json(user);
        }
      });
    });
  } catch {
    console.log(error);
  }
};
exports.signIn = async function (req, res) {
  const data = req.body;
  const user = await User.findOne({ email: data.email }).select("+password");
  if (!user) {
    return res.status(404).json({ msg: "Invalid Credentials" });
  } else {
    bcrypt.compare(data.password, user.password, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
      }
      if (!result) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      } else {
        user.token = jwt.sign(
          { id: user._id, email: user.email },
          ACCESS_SECRET
        );
        return res.status(200).json(user);
      }
    });
  }
};

exports.getUserbyid = async (req, res) => {
  User.findById(req.params.id, (err, data) => {
    // data = filterOutPasswordField(data);
    if (err) {
      return res.status(400).send({ success: false, msg: "user not found" });
    }

    if (data) {
      return res.status(200).send({ success: true, user: data._doc });
    }
  });
};

exports.update = async (req, res) => {
  const user = req.body;
  User.findByIdAndUpdate(req.params.id, user, { new: true }, (err, data) => {
    if (data) {
      return res.status(200).send({ success: true, updated: data });
    }
    if (err) {
      return res.status(400).send({ success: false, msg: "user not found" });
    }
  });
};

exports.delete_user = async function (req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: `No user with id ${req.params.id}` });
    } else {
      await Income.deleteMany({user_id:req.params.id})
      await Church.deleteMany({user_id:req.params.id})
      return res
        .status(200)
        .json({ msg: "User Deleted Successfully", data: null });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:"An Error Occured"})
  }
};


exports.forgotPassword = async function (req, res) {
  let codeSend = generateCode(5);
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "User Not Found" });
  } else {
    user.code = codeSend;
    user.save();
    try {
      sendCode(email, codeSend);
      return res.status(200).json({ msg: "Code Sent to Email" });
    } catch (error) {
      return res
        .status(400)
        .json({ msg: "Code Not Sent to Email.Please Try Again" });
    }
  }
};

exports.verifyCode = async function (req, res) {
  const { email, code } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "User Not Found" });
  } else {
    if (user.code == code) {
      user.code = undefined;
      user.save();
      return res.status(200).json({ msg: "Code  is Valid" });
    } else {
      return res.status(400).json({ msg: "Invalid Code" });
    }
  }
};

exports.updatepassword = async (req, res) => {
  const data = req.body;
  const email_exists = await User.findOne({ email: data.email });
  if (!email_exists) {
    return res.status(400).json({ msg: "email does not exists" });
  }
  bcrypt.hash(data.password, salt, (err, hash) => {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    if (hash) {
      data.password = hash;
      User.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true },
        (err, data) => {
          if (data) {
            return res.status(200).send({ success: true, updated: data });
          }
          if (err) {
            return res
              .status(400)
              .send({ success: false, msg: "user not found" });
          }
        }
      );
    }
  });
};


exports.addIncome = async function (req, res) {
  const data = req.body;
  try {
    const user = await User.findById(req.params.id)
    if(!user){
      return res.status(404).json({ msg: `No user with id ${req.params.id}` });
    }
    data.user_id = user.id
    const income = new Income(data);
    income.save();
    return res.status(201).json(income);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error });
  }
};

exports.getIncomes = async function (req, res) {
  try {
    data = await Income.find({ id: req.params.id });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error });
  }
};

exports.getIncome = async function (req, res) {
  try {
    const data = await Income.findById(req.params.inc_id);
    if (!data) {
      return res.status(404).json({ msg: "Not Found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    if (error.name == "CastError") {
      return res.status(400).json(error.message);
    }
    return res.status(500).json(error);
  }
};

exports.updateIncome = async function (req, res) {
  const update = req.body;
  Income.findByIdAndUpdate(
    req.params.inc_id,
    update,
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        return res
          .status(200)
          .json({ msg: "Income updated successfully", data: data });
      }
    }
  );
};

exports.delete_income = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    const income = await Income.findByIdAndDelete(req.params.inc_id);
    // if(!user){
    //     return res.status(404).json({msg:`No user with id ${req.params.id}`})
    // }
    if (!income) {
      return res
        .status(404)
        .json({ msg: `No income with id ${req.params.id}` });
    } else {
      return res
        .status(200)
        .json({ msg: "Income Deleted Successfully", data: null });
    }
  } catch (error) {
    console.log(error);
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

exports.addChurch = async function (req, res) {
  const data = req.body;
  const subacct_exists = await SubAccount.findOne({ accountNumber: data.accountNumber });
  const user = await User.findById(req.params.id);
  const details = {
    address: data.address,
    name: data.name,
    serviceDays: data.serviceDays
  };
  if (!user) {
    return res.status(404).json({ msg: `No user with id ${req.params.id}` });
  }
  if (!subacct_exists) {
    const subAccountData = await createSubAccount(data,user);
    if(subAccountData){
      const bankname= subAccountData.bank_name;
      details.user_id = user.id;
      const account = {accountName:data.accountName, accountNumber:data.accountNumber,bankCode:data.bank.code,subAccountId:subAccountData.subaccount_id,bankName:bankname};
      const subacct = new SubAccount(account);
      details.subAccountIds=subacct.id;
      const church = new Church(details);
      subacct.save();
      church.save();
      return res.status(201).json(church);
    }
  }else if (subacct_exists) {
    const details = {
      address: data.address,
      name: data.name,
      serviceDays: data.serviceDays,
      subAccountIds:subacct_exists.id
    };
    details.user_id = user.id;
    const account = {accountName:data.accountName, accountNumber:data.accountNumber,bankCode:data.bankCode,subAccountId:subacct_exists.id,bankName:subacct_exists.bankName};
    const church = new Church(details);
    church.save();
    return res.status(201).json(church);
    
  }
};

exports.getChurches = async function (req, res) {
  try {
    const user = User.findById(req.params.id)
    if(!user){
      return res.status(404).json({msg:`User with id ${req.params.id} not found`});
    }
    const churches = await Church.find({ user_id: req.params.id });
    return res.status(200).json(churches);
  } catch (error) {
    console.log(error)
    res.status(500).json({msg:"An Error Occured"})
  }

};

exports.getChurch = async function (req, res) {
  try {
    const church = await Church.findById(req.params.church_id);
    return res.status(200).json(church);
  } catch (error) {
    res.status(500).json({msg:"An Error Occured"})
  }

};

exports.updateChurch = async function (req, res) {
  const data = req.body;

  Church.findByIdAndUpdate(
    req.params.inc_id,
    update,
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        return res
          .status(200)
          .json({ msg: "Church updated successfully", data: data });
      }
    }
  );
};

exports.deleteChurch = async function (req, res) {
  try {
    Church.findByIdAndDelete(req.params.church_id,(err,church)=>{
      if(err){
        return res.status(404).json({msg:`Church with id ${req.params.church_id} not found`})
      }
      if(church){
        return res.status(200).json({message:"Church deleted successfully", data:null})
      }
    })
  } catch (error) {
    return res.status(500).json({msg:"An Error Occured"})
  }
};


exports.getChurchAccounts = async function(req,res){
  try {
    const church = await Church.findById(req.params.church_id).populate('subAccountIds');
    if(!church){
      return res.status(404).json({msg:`Church with id ${req.params.church_id} not found`});
    }else{
      const accounts = church.subAccountIds
      return res.status(200).json(accounts);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:"An Error Occured"});
  }
}

exports.getChurchAccount = async function(req,res){
  try {
    const account = await SubAccount.findById(req.params.acc_id);
    if(!account){
      return res.status(404).json({msg:`Account with id ${req.params.acc_id} not found`});
    }else{
      return res.status(200).json(account);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:"An Error Occured"});
  }
}


exports.getTransactions = async function(req,res){
  try {
    const user = await User.findById(req.params.id);
    const transactions = await Transaction.find({user_id:req.params.id}).sort({createdAt:-1});
    if(!user){
      return res.status(404).json({msg:`User with id ${req.params.tran_id} not found`});
    }else{
      return res.status(200).json(transactions);
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"An Error Occured"});
  }

}

exports.getTransaction = async function(req,res){
  try {
    const user = await User.findById(req.params.id);
    const transaction = await Transaction.findById(req.params.tran_id);
    if(!user){
      return res.status(404).json({msg:`User with id ${req.params.id} not found`});
    }else if(!transaction){
      return res.status(404).json({msg:`Transaction with id ${req.params.tran_id} not found`});
    }else{
      return res.status(200).json(transaction);
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"An Error Occured"});
  }

}