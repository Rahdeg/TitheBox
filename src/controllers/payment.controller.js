const Flutterwave = require('flutterwave-node-v3');
const axios = require("axios");
const {getChargeFee, calaculateTithe} = require("../utils/functions")

require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB,process.env.FLUTTER_SEC);

const api = axios.create({
    baseURL:'https://api.flutterwave.com/v3',
    headers:{Authorization: `Bearer ${FLUTTER_SEC}`}
})

exports.paymentSuccessful = async function(req,res){
    const status = req.query.status
    // const transaction_id = req.query.transaction_id
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
exports.payment = async function(){
    try {
        const currency = "NGN"; // will need to specify this field in the income model
        const amount  = calaculateTithe(req.params.inc_id,req.params.id)
        const charge = getChargeFee(amount,currency)
        user = User.findById(req.params.id);
        if(!user){
            return res.status(404).json({msg:"User Not Found"})
        }
        const data = {
            tx_ref: "test_tithe_1",
            amount: amount,
            currency: "NGN",
            redirect_url: "http://localhost:4000/api/v1/users/paymentSuccess",
            meta: {
                consumer_id: req.params.id,
                consumer_church: user.church
            },
            customer: {
                email: user.email,
                phonenumber: user.phonenumber,
                name: `${user.firstname} ${user.lastname}`
            }
        };
        const response = await api.post("/payments",data);
        console.log(response)
        return res.status(200).json({url:response})
    } catch (err) {
        console.log(err);
    }
}