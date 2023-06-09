const Flutterwave = require("flutterwave-node-v3");
const axios = require("axios");
const { User } = require("../models/user.model");
const AsyncManager = require("../utils/asyncManager");
const LibraryError = require("../utils/libraryError");
const {Walett  } = require("../models/walett.model");
const { Church } = require("../models/church.model");
const { Income } = require("../models/income.model");
const {Transaction} = require("../models/transaction.model")


const { calculateTithe, getChargeFee, transferToChurch, transferToWalett, createVitualAcct } = require("../utils/functions");

require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB, process.env.FLUTTER_SEC);

const api = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
  headers: { Authorization: `Bearer ${process.env.FLUTTER_SEC}` },
});

exports.createAwallet=AsyncManager(async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
        const walett = await Walett.find({user_id: req.params.id});
     if (!user) {
            return res.status(404).json({ msg: `No user with id ${req.params.id}` });
          };
    if (walett.length) {
        user.walettId =walett[0]._id;
            await user.save();
            return res.status(200).json(walett);
        }
      const createWalett= await createVitualAcct(user);

      const walettData ={
        user_id:user.id,
        orderRef:createWalett.order_ref,
        email:user.email,
        accountNumber:createWalett.account_number,
        bankName:createWalett.bank_name,
        accountName:`${user.firstName} ${user.lastName}`,
        mobileNumber:user.phoneNumber,
        flwRef:createWalett.flw_ref,
      }
      const walettDetails = await Walett.create(walettData);
      user.walettId =walettDetails._id;
      await user.save();
        return res.status(200).json(walettDetails);
    } catch (error) {
        console.log(error)
        return next(new LibraryError(error.message, 404));
    }
})


exports.getAWalett=AsyncManager(async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    const walett = await Walett.find({user_id: req.params.id});
    if (!user) {
      return res.status(404).json({ msg: `No user with id ${req.params.id}` });
    };


    return res.status(200).json(walett);
  } catch (error) {
    console.log(error)
        return next(new LibraryError(error.message, 404));
  }
})

exports.getWalettTransactions=AsyncManager(async(req,res,next)=>{
  try {
      const user = await User.findById(req.params.id);
      const walett = await Walett.findById(req.params.walett_id);
      const transactions = await Transaction.find({user_id: req.params.id});

  if (!user) {
          return res.status(404).json({ msg: `No user with id ${req.params.id}` });
        }

  if (!walett) {
          return res.status(404).json({ msg: `No walett with id ${req.params.walett_id}` });
        }

  if (!transactions) {
          return res.status(404).json({ msg: `No transaction found for this user` });
        }
        
        
        return res.status(200).json(transactions);
        
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
    
    
    const currency = income.currency;
    const amount = await calculateTithe(req.params.income_id, req.params.id, res);
    const charge = await getChargeFee(amount, currency);
    const total_amount = (amount + charge + 15).toFixed(2) ;
    const walettBalance = walett.balance;
    

    if (total_amount < 100 ) {
      return res.status(404).json({ msg: ' Amount is below minimum limit of 100' });
    }

    if (walettBalance <= total_amount ) {
      return res.status(404).json({ msg: 'Insufficient funds' });
    }
        
      const transfer = await  transferToChurch(church,user,amount,income);
      // return res.status(200).json(transfer.data);
      if (transfer.data.status === 'success') {
        walett.balance = (walett.balance - total_amount).toFixed(2)
        await walett.save()
        if (user.totalTithe) {
          user.totalTithe = (user.totalTithe + amount).toFixed(2)
          await user.save()
        }
        const detail = {
          user_id:user._id,
          flw_tran_id:transfer.data.data.reference,
          amount:(transfer.data.data.amount + transfer.data.data.fee).toFixed(2),
          type:"Debit",
          balance:(walett.balance).toFixed(2),
          status: transfer.data.data.status
      }

      await Transaction.create(detail);

        return res.status(200).json({ msg: 'Transaction Successfull' });
      } else{
        return res.status(404).json({ msg: 'Something went wrong' });
      }

        
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
    

        const data = req.body;

        if (data.amount < 100 ) {
          return res.status(404).json({ msg: ' Amount is below minimum limit of 100' });
        }

        if (walett.balance <= data.amount ) {
          return res.status(404).json({ msg: 'Insufficient funds' });
        }
   const total_amount = Number(data.amount) + 15;

   if (walett.balance <= total_amount ) {
    return res.status(404).json({ msg: 'Insufficient funds' });
  }
            
    const transferData={
    "account_bank": church.bank.code, 
    "account_number": church.accountNumber,
    "amount": Number(data.amount).toFixed(2),
    "email" : user.email,
    "narration":  `${user.firstName} ${user.lastName}, ${data.narration} from Tithebox App`,
    "currency": 'NGN',
    }
    
    const transferResponse = await api.post("/transfers", transferData);

    if (transferResponse.data.status === 'success') {
      walett.balance = (walett.balance - total_amount).toFixed(2)
      await walett.save()

      const detail = {
        user_id:user._id,
        flw_tran_id:transferResponse.data.data.reference,
        amount:(transferResponse.data.data.amount + transferResponse.data.data.fee).toFixed(2),
        type:"Debit",
        balance:(walett.balance).toFixed(2),
        status: transferResponse.data.data.status
    }

    await Transaction.create(detail);

      return res.status(200).json({ msg: 'Transaction Successfull' });
    } else{
      return res.status(404).json({ msg: 'Something went wrong' });
    }

        
  } catch (error) {
      console.log(error)
      return next(new LibraryError(error.message, 404));
  }
})
