const Flutterwave = require('flutterwave-node-v3');
const axios = require("axios");
const {getChargeFee, calculateTithe, createSubAccount} = require("../utils/functions")
const {User} = require("../models/user.model");
const {SubAccount} = require("../models/subAccount.model")
const {Income} = require("../models/income.model");
const { Church } = require('../models/church.model');


require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB,process.env.FLUTTER_SEC);

const api = axios.create({
    baseURL:'https://api.flutterwave.com/v3',
    headers:{Authorization: `Bearer ${process.env.FLUTTER_SEC}`}
})

exports.paymentSuccessful = async function(req,res){
    const status = req.query.status
    const transaction_id = req.query.transaction_id
    // const tx_ref = req.query.tx_ref
    if(status === "successful"){
        const transactionDetails = await flw.Transaction.verify({id:transaction_id})
        console.log(transactionDetails)
        return res.status(200).json({msg:"Payment successful"})
    }
    if(status === "cancelled"){
        // no transaction_id generated
        return res.status(200).json({msg:"payment cancelled"})
    }
}

// will need to update subaccount if user changes details of church
exports.payment = async function(req,res){
    try {
        const user = await User.findById(req.params.id);
        const income = await Income.findById(req.params.inc_id);
        const church = await Church.findById(req.params.church_id);
        const account = await SubAccount.findById(req.params.acc_id)
        if(!user){
            return res.status(404).json({msg:`User With ${req.params.id} Not Found`})
        }
        if(!income){
            return res.status(404).json({msg:`Income With ${req.params.inc_id} Not Found`})
        }
        if(!church){
            return res.status(404).json({msg:`Church With ${req.params.church_id} Not Found`})
        }
        if(!account){
            return res.status(404).json({msg:`Account/SubAccount With ${req.params.acc_id} Not Found`})
        }
        const currency = income.currency;
        const amount  = await calculateTithe(req.params.inc_id,req.params.id)
        const charge = await getChargeFee(amount,currency);
        const total_amount = amount + charge 
        const data = {
            tx_ref: "test_tithe_12",
            amount: total_amount,
            currency: currency,
            redirect_url: "http://localhost:4000/api/v1/redirect/paymentSuccess",
            meta: {
                consumer_id: req.params.id,
                consumer_church: church.name
            },
            customer: {
                email: user.email,
                phonenumber: user.phoneNumber,
                name: `${user.firstName} ${user.lastName}`
            },
            subaccounts:[
                {
                    id:account.subAccountId,
                    transaction_charge_type:"flat",
                    transaction_charge:charge
                }
            ]
        };
        console.log(data)
        const response = await api.post("/payments",data);
        // return res.send(data);
        return res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({status:"error",message:"Payment Could not be processed, Please Try Again"})
    }
}

exports.tester = async function(req,res){
    // const result = await flw.Subaccount.delete({id:"RS_CDD922C2B0B8FA2660B90A443200120F"})
    const result = await SubAccount.find()
    // const result = await SubAccount.findByIdAndDelete("62e9ae019d60b9d218803dbc")
    // const result = await flw.Subaccount.fetch_all()
    // const result = await flw.Bank.country({country:"GH"})
    console.log(result)
    return res.json(result)
}

