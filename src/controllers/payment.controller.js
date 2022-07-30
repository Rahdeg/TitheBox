const Flutterwave = require('flutterwave-node-v3');
const axios = require("axios");
const {getChargeFee, calculateTithe, createSubAccount} = require("../utils/functions")
const {User} = require("../models/user.model");
const {Income} = require("../models/income.model");


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
        const transactionDetails = await flw.Transaction.verify(transaction_id)
        return res.status(200).json({msg:"Payment successful"})
    }
    if(status === "cancelled"){
        const transactionDetails = await flw.Transaction.verify(transaction_id)
        return res.status(200).json({msg:"payment cancelled"})
    }
}

// will need to create subaccounts for church accounts when user creates them
// will need to update subaccount if user changes details of church
exports.payment = async function(req,res){
    try {
        const user = await User.findById(req.params.id)
        const income = await Income.findById(req.params.inc_id)
        if(!user){
            return res.status(404).json({msg:`User With ${req.params.id} Not Found`})
        }
        if(!income){
            return res.status(404).json({msg:`Income With ${req.params.inc_id} Not Found`})
        }
        const churches = user.churches
        const church = churches.find((church)=>{return church.id===req.params.church_id;})
        const currency = income.currency; // will need to specify this field in the income model
        const amount  = await calculateTithe(req.params.inc_id,req.params.id)
        const charge = await getChargeFee(amount,currency);
        
        const data = {
            tx_ref: "test_tithe_10",
            amount: amount,
            currency: "NGN",
            redirect_url: "http://localhost:4000/api/v1/users/paymentSuccess",
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
                    id:church.subAccountId,
                    transaction_charge_type:"flat",
                    transaction_charge:charge
                }
            ]
        };
        const response = await api.post("/payments",data);
        return res.status(200).json(response.data)
    } catch (err) {
        console.log(err);
    }
}

exports.tester = async function(req,res){
    // const result = await flw.Subaccount.delete({id:"RS_05D1FE11FE1E581066D4A29625E6D3F0"})
    // const result = await flw.Subaccount.fetch_all()
    const result = await flw.Bank.country({country:"GH"})
    console.log(result)
    return res.json("testing")
}

