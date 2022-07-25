const Flutterwave = require('flutterwave-node-v3');
const axios = require("axios");
const {getChargeFee, calaculateTithe} = require("../utils/functions")

require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB,process.env.FLUTTER_SEC);

const api = axios.create({
    baseURL:'https://api.flutterwave.com/v3',
    headers:{Authorization: `Bearer ${process.env.FLUTTER_SEC}`}
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

exports. createSubaccount = async function(){

    try {
        const payload = {
            "account_bank": "044",
            "account_number": "0690000037",
            "business_name": "Eternal Blue",
            "business_email": "petya@stux.net",
            "business_contact": "Anonymous",
            "business_contact_mobile": "090890382",
            "business_mobile": "09087930450",
            "country": "NG",
            "meta": [
                {
                    "meta_name": "mem_adr",
                    "meta_value": "0x16241F327213"
                }
            ],
            "split_type": "percentage",
            "split_value": 0.5
        }

        const response = await flw.Subaccount.create(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}

exports. updateSubaccount = async function () {

    try {

        const payload = {
            "id": "3244", //This is the unique id of the subaccount you want to update. It is returned in the call to create a subaccount as data.id
            "business_name": "Xyx lol!",
            "business_email": "mad@o.enterprises",
            "account_bank": "044",
            "account_number": "0690000040",
            "split_type": "flat",
            "split_value": "200"
        }


        const response = await flw.Subaccount.update(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}