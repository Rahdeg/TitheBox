const Flutterwave = require("flutterwave-node-v3");
const axios = require("axios");
const { User } = require("../models/user.model");
const AsyncManager = require("../utils/asyncManager");
const LibraryError = require("../utils/libraryError");
const { date } = require("joi");

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
            account_name:user.lastName,
            email:"walett991@gmail.com",
            mobilenumber:user.phoneNumber,
            country:"NG",
            account_reference:"1234567890asdfghjklo",
          }
          
          const response = await api.post("/payout-subaccounts", data);
          return res.status(200).json(response.data);
          
    } catch (error) {
        console.log(error)
        return next(new LibraryError(error.message, 404));
    }
})


