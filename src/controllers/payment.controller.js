const Flutterwave = require('flutterwave-node-v3');
const axios = require("axios");
const {getChargeFee, calculateTithe, createSubAccount} = require("../utils/functions")
const {User} = require("../models/user.model");
const {SubAccount} = require("../models/subAccount.model")
const {Income} = require("../models/income.model");
const { Church } = require('../models/church.model');
const {Transaction} = require("../models/transaction.model");


require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB,process.env.FLUTTER_SEC);

const api = axios.create({
    baseURL:'https://api.flutterwave.com/v3',
    headers:{Authorization: `Bearer ${process.env.FLUTTER_SEC}`}
})

exports.paymentSuccessful = async function(req,res){
    const status = req.query.status
    try {
        if(status === "successful"){
            const transaction_id = req.query.transaction_id
            const tx_ref = req.query.tx_ref
            const result = await flw.Transaction.verify({id:transaction_id});
            const transaction = await Transaction.findById(tx_ref);
            let fee = await getChargeFee(transaction.amount, result.data.currency);
            let amount = transaction.amount + fee;
            if(result.data.status=="successful"
            &&result.data.amount == amount
            &&result.data.currency == transaction.currency
            ){
                transaction.status="successful"
                transaction.save();
                return res.status(200).json({msg:"Payment Successful"});
            }else{
                let transaction = await Transaction.findByIdAndDelete(req.params.tran_id);
                return res.status(200).json({msg:"Payment Not Successful"});
            }
        }else if(status === "cancelled"){
            let transaction = await Transaction.findByIdAndDelete(req.params.tran_id);
            return res.status(200).json({msg:"Payment Cancelled"})
        }else if(status === "failed"){
            let transaction = await Transaction.findByIdAndDelete(req.params.tran_id);
            return res.status(200).json({msg:"Payment failed"})
        }
    } catch (error) {
        console.log(error)
        return res.status(200).json({msg:"An Error Occured"})
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
        const transactionDetails = {
            user_id:user.id,
            income_id:income.id,
            amount:amount,
            church:church.id,
            tithePercentage:income.tithePercentage,
            currency:income.currency
        }
        const transaction = Transaction(transactionDetails);
        transaction.save()
        const data = {
            tx_ref: `${transaction.id}`,
            amount: total_amount,
            currency: currency,
            redirect_url: `http://{localhost:${process.env.PORT}||https://tithebox.herokuapp.com}/api/v1/redirect/payment/${transaction.id}`,
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
        const response = await api.post("/payments",data);
        return res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({status:"error",message:"Payment Could not be processed, Please Try Again"})
    }
}

exports.tester = async function(req,res){
    const result = await flw.Subaccount.delete({id:"RS_AF5297B94EEF1FFDEE01ABCED6E3582E"})
    // const result = await SubAccount.find()
    // const result = await SubAccount.findByIdAndDelete("62e9aed84cea001d128f5c36")
    // const result = await flw.Subaccount.fetch_all()
    // const result = await flw.Bank.country({country:"GH"})
    console.log(result)
    return res.json(result)
}

