const Transport = require("../verification/nodemailer");
const Flutterwave = require('flutterwave-node-v3');

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

exports.filterOutPasswordField=function(data) {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !key.includes("password"))
    );

    return filteredData;
}

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