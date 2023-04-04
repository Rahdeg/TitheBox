const Flutterwave = require("flutterwave-node-v3");
const axios = require("axios");
const { User } = require("../models/user.model");
const AsyncManager = require("../utils/asyncManager");
const LibraryError = require("../utils/libraryError");
const {Walett  } = require("../models/walett.model");

require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB, process.env.FLUTTER_SEC);

const api = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
  headers: { Authorization: `Bearer ${process.env.FLUTTER_SEC}` },
});

exports.createWallet=AsyncManager(async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
    if (!user) {
            return res.status(404).json({ msg: `No user with id ${req.params.id}` });
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

          return res.status(200).json(walettDetails);
          
    } catch (error) {
        console.log(error)
        return next(new LibraryError(error.message, 404));
    }
})


