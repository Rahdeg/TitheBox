const Transport = require("../verification/nodemailer");

exports.sendCode = function(email,code){
    mailOptions={
        from:"Tithe Box",
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

exports.generateCode = function(codeLength){
    let randomCode="";
    for(let i=0;i<codeLength;i++){
        randomNumber=Math.floor(Math.random()*10);
        randomCode+=randomNumber;
    }
    return randomCode;
}
