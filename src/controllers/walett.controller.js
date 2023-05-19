const Flutterwave = require("flutterwave-node-v3");
const axios = require("axios");
const { User } = require("../models/user.model");
const AsyncManager = require("../utils/asyncManager");
const LibraryError = require("../utils/libraryError");
const {Walett  } = require("../models/walett.model");
const { Church } = require("../models/church.model");
const { Income } = require("../models/income.model");

const { calculateTithe, getChargeFee, transferToChurch } = require("../utils/functions");

require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB, process.env.FLUTTER_SEC);

const api = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
  headers: { Authorization: `Bearer ${process.env.FLUTTER_SEC}` },
});

exports.createWallet=AsyncManager(async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
        const waletts = await Walett.find();
        const foundWallet = waletts.find(wallet => wallet?.email === user?.email);
    if (!user) {
            return res.status(404).json({ msg: `No user with id ${req.params.id}` });
          };
    if(user.walettId){
      const walett = await Walett.findById(user.walettId)
      return res.status(404).json(walett);
    };

    if (foundWallet) {
      user.walettId = walettId;
              await user.save();
      return res.status(404).json(foundWallet);
      
    }


          const data ={
            account_name:user.firstName,
            email:user.email,
            mobilenumber:user.phoneNumber,
            country:"NG",
          }
          
          const response = await api.post("/payout-subaccounts", data);
          const walett = response.data.data;

          const walettData ={
            user_id:user.id,
            id:walett.id,
            accountReference:walett.account_reference,
            accountName:walett.account_name,
            barterId:walett.barter_id,
            email:walett.email,
            mobileNumber:walett.mobilenumber,
            nuban:walett.nuban,
            bankName:walett.bank_name,
            bankCode:walett.bank_code,
            status:walett.status,
          }
        
          const walettDetails = await Walett.create(walettData);
          const walettId = walettDetails._id;

          user.walettId = walettId;
              await user.save();
              
          return res.status(200).json(walettDetails);
          
    } catch (error) {
        console.log(error)
        return next(new LibraryError(error.message, 404));
    }
})


exports.getWalett=AsyncManager(async(req,res,next)=>{
  try {
      const user = await User.findById(req.params.id);
      const walett = await Walett.findById(req.params.walett_id);

  if (!user) {
          return res.status(404).json({ msg: `No user with id ${req.params.id}` });
        }

  if (!walett) {
          return res.status(404).json({ msg: `No walett with id ${req.params.walett_id}` });
        }
        
        const walettDetails = await Walett.find({user_id: req.params.id});

        return res.status(200).json(walettDetails);
        
  } catch (error) {
      console.log(error)
      return next(new LibraryError(error.message, 404));
  }
})

exports.getWalettTransactions=AsyncManager(async(req,res,next)=>{
  try {
      const user = await User.findById(req.params.id);
      const walett = await Walett.findById(req.params.walett_id);

  if (!user) {
          return res.status(404).json({ msg: `No user with id ${req.params.id}` });
        }

  if (!walett) {
          return res.status(404).json({ msg: `No walett with id ${req.params.walett_id}` });
        }
        
        const response = await api.get(`/payout-subaccounts/${walett.accountReference}/transactions`);

        return res.status(200).json(response.data);
        
  } catch (error) {
      console.log(error)
      return next(new LibraryError(error.message, 404));
  }
})

exports.getWalettBalance=AsyncManager(async(req,res,next)=>{
  try {
      const user = await User.findById(req.params.id);
      const walett = await Walett.findById(req.params.walett_id);

  if (!user) {
          return res.status(404).json({ msg: `No user with id ${req.params.id}` });
        }

  if (!walett) {
          return res.status(404).json({ msg: `No walett with id ${req.params.walett_id}` });
        }
        
        const response = await api.get(`/payout-subaccounts/${walett.accountReference}/balances`);

        return res.status(200).json(response.data);
        
  } catch (error) {
      console.log(error)
      return next(new LibraryError(error.message, 404));
  }
})

exports.payTithe=AsyncManager(async(req,res,next)=>{
  try {
      const user = await User.findById(req.params.id);
      const church = await Church.findById(req.params.church_id);
      const income = await Income.findById(req.params.income_id);
      const walett = await Walett.findById(req.params.walett_id);
      

  if (!user) {
          return res.status(404).json({ msg: `No user with id ${req.params.id}` });
        }

        if (!church) {
          return res.status(404).json({ msg: `No church with id ${req.params.church_id}` });
        }

        if (!income) {
          return res.status(404).json({ msg: `No income with id ${req.params.income_id}` });
        }

  if (!walett) {
          return res.status(404).json({ msg: `No walett with id ${req.params.walett_id}` });
        }
    
     const response = await api.get(`/payout-subaccounts/${walett.accountReference}/balances`);
    const walettBalance= response.data?.data?.available_balance
 
    const amount = await calculateTithe(req.params.income_id, req.params.id, res);
    // const charge = await getChargeFee(amount, currency);
    // const total_amount = amount + charge;
    if (walettBalance <= amount ) {
      return res.status(404).json({ msg: 'Insufficient funds' });
    }
        
      const transfer = await  transferToChurch(church,user,walett,amount,income);
      return res.status(200).json(transfer.data);
        
  } catch (error) {
      console.log(error)
      return next(new LibraryError(error.message, 404));
  }
})

exports.otherTransfers=AsyncManager(async(req,res,next)=>{
  try {
      const user = await User.findById(req.params.id);
      const church = await Church.findById(req.params.church_id);
      const walett = await Walett.findById(req.params.walett_id);

  if (!user) {
          return res.status(404).json({ msg: `No user with id ${req.params.id}` });
        }

  if (!church) {
          return res.status(404).json({ msg: `No church with id ${req.params.church_id}` });
        }


  if (!walett) {
          return res.status(404).json({ msg: `No walett with id ${req.params.walett_id}` });
        }
    
        const response = await api.get(`/payout-subaccounts/${walett.accountReference}/balances`);
       
        const walettBalance= response.data?.data?.available_balance

        const data = req.body;

        if (data.amount < 100 ) {
          return res.status(404).json({ msg: ' Amount is below minimum limit of 100' });
        }

        if (walettBalance <= data.amount ) {
          return res.status(404).json({ msg: 'Insufficient funds' });
        }

       
            
    const transferData={
    "account_bank": church.bank.code, 
    "account_number": church.accountNumber,
    "amount": data.amount,
    "email" : user.email,
    "narration":  `${user.firstName} ${user.lastName}, ${data.narration} from Tithebox App`,
    "currency": 'NGN',
    "debit_subaccount":walett.accountReference, 
    }
    
    const transferResponse = await api.post("/transfers", transferData);
      return res.status(200).json(transferResponse.data);
        
  } catch (error) {
      console.log(error)
      return next(new LibraryError(error.message, 404));
  }
})
