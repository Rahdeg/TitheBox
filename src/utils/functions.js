const Transport = require("../verification/nodemailer");
const Flutterwave = require('flutterwave-node-v3');
const {User} = require("../models/user.model")

require("dotenv").config();
const flw = new Flutterwave(process.env.FLUTTER_PUB,process.env.FLUTTER_SEC);

const Income = require("../models/income.model");

exports.sendCode = function(email,code){
    mailOptions={
        from:"walett95@gmail.com",
        to:email,
        subject:"Forgot Password",
        html:`<h4>Kindly Enter the following Code:</h4>
        <h1 style="background:blue; color:white; text-align:center;">${code}</h1>`
    }
    Transport.sendMail(mailOptions,function(error,response){
        if(error){
            console.log(error)
            return {status:"Error",msg:"Email Not Sent"};
        }else{
            return {status:"Ok",msg:"Email Sent Successfully"};
        }
    })
};

exports.senddetails = function(data){
    mailOptions={
        from: "walett95@gmail.com",
            to: data.email,
            subject: "Account created successfully",
            text: "Thank you for creating an account with us, click here to comfirm your Registration and Login.",
    }
    Transport.sendMail(mailOptions,function(error,response){
        if(error){
            console.log(error)
            return {status:"Error",msg:"Email Not Sent"};
        }else{
            console.log("Email Sent Successfully")
            return {status:"Ok",msg:"Email Sent Successfully"};
        }
    })
};


exports.updatepassword = function(data){
    mailOptions={
        from: "walett95@gmail.com",
            to: data.email,
            subject: "Password Reset",
            text: "Your password has been reset Successfully!",
    }
    Transport.sendMail(mailOptions,function(error,response){
        if(error){
            console.log(error)
            return {status:"Error",msg:"Email Not Sent"};
        }else{
            console.log("Email Sent Successfully")
            return {status:"Ok",msg:"Email Sent Successfully"};
        }
    })
};


exports.generateCode = function(codeLength){
    let randomCode="";
    for(let i=0;i<codeLength;i++){
        randomNumber=Math.floor(Math.random()*10);
        randomCode+=randomNumber;
    }
    return randomCode;
}

// exports.filterOutPasswordField=function(data) {
//     const filteredData = Object.fromEntries(
//       Object.entries(data).filter(([key]) => !key.includes("password"))
//     );

//     return filteredData;
// }

exports.getChargeFee = async function(amount,currency){
    try {
        let detail = {amount,currency};
        const flutter_fee = await flw.Transaction.fee(detail);
        const gain = flutter_fee.data.flutterwave_fee;
        return gain
    } catch (error) {
        console.log(error)
    }

}

exports.calaculateTithe = async function(income_id,user_id){
    try {
        const income = await Income.findById(income_id)
        if(income.user_id != user_id){
            return res.status(400).json({msg:"User and income detail don't match"})
        }
        amount = Number(income.amount)
        percentage = Number(income.tithePercentage)
        const titheAmount = amount*(percentage/100)
        return titheAmount

    } catch (error) {
        console.error(error)
    }

}

exports.createSubAccount = async function(user_id){
    let payload = {}
    try {
        let country = {"country":"NG"}
        // create an endpoint to serve the frontend with the list of Banks
        // let banks = await flw.Bank.country(country)
        let user = await User.findById(user_id);
        const churches = user.churches
        for (let church of churches){
            if (!church.subAccountId){
                payload.country = country.country;
                payload.account_bank = "044";
                payload.account_number = church.accountNumber;
                payload.business_name = church.name;
                payload.business_email  = user.email;
                payload.business_contact_mobile = user.phoneNumber;
                payload.business_contact = church.address;
                payload.split_type = "flat";
                payload.split_value = 20;
                const result = await flw.Subaccount.create(payload);
                church.subAccountId = result.data.subaccount_id;
            }else{
                continue;
            }
        }
        user.save();
    } catch (error) {
        console.error(error)
    }


exports. updateSubaccount = async function (data) {

    try {

        const payload = {
            "id": "3244", //This is the unique id of the subaccount you want to update. It is returned in the call to create a subaccount as data.id
            "business_name": data.firstName,
            "business_email": data.emial,
            "account_bank": '044',
            "account_number": data.churches[0].accountNumber,
            "split_type": "flat",
            "split_value": "200"
        }


        const response = await flw.Subaccount.update(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}





exports. getbankcode = async function(){
    try {
        const payload = {
            
            "country":"NG" //Pass either NG, GH, KE, UG, ZA or TZ to get list of banks in Nigeria, Ghana, Kenya, Uganda, South Africa or Tanzania respectively
            
        }
        const response = await flw.Bank.country(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}