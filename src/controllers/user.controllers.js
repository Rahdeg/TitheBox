const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model").User;
const {Income} = require("../models/income.model");
const transporter= require('../verification/nodemailer')
require("dotenv").config();
const salt = parseInt(process.env.SALT);
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET

exports.signUp = async function(req,res){
    const data = req.body;
    const email_exists = await User.findOne({email:data.email});
    if(email_exists){
        return res.status(400).json({msg:"email already exists"});
    }
    bcrypt.hash(data.password, salt,(err,hash)=>{
        if(err){
            return res.status(500).json({msg:err})
        }
        if(hash){
            data.password = hash
        }
        const user = new User(data);
        user.token = jwt.sign({id:user.id,email:user.email},ACCESS_SECRET)
        user.save();
        const options = {
            from: "walett95@gmail.com",
            to: [data.email, "rahdegonline@gmail.com"],
            subject: "Account created successfully",
            text: "Thank you for creating an account with us, click here to comfirm your Registration and Login.",
          };
          transporter.sendMail(options, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log("email sent :", data.response);
            }
          });
        return res.status(201).json(user);
        
    });
   
};
exports.signIn = async function(req,res){
    const data = req.body;
    const user = await User.findOne({email:data.email}).select("+password");
    if(!user){
        return res.status(404).json({msg:"Invalid Credentials"})
    }else{
        bcrypt.compare(data.password,user.password, (err, result)=>{
            if(err){
                console.log(err);
                return res.status(500).json({msg:err});
            }
            if(!result){
                return res.status(400).json({msg:"Invalid Credentials"});
            }else{
                user.token = jwt.sign({id:user._id,email:user.email},ACCESS_SECRET);
                return res.status(200).json(user);
            }
        })
        
    }
};



exports.update= async (req,res)=>{
const user = req.body;  
User.findByIdAndUpdate(req.params.id,user ,{new:true}, (err, data)=>{
    if (data) {
        return  res.status(200).send({success:true, updated:data}); 
    }
    if (err) {
        return  res.status(400).send({success:false, msg:'user not found'});
    }
})
}

exports.addIncome = async function(req,res){
    const data = req.body
    try {
        const income = new Income(data)
        income.save()
        return res.status(201).json(income);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({msg:error});
    }

}

exports.getIncomes = async function(req,res){
    try {
        data = await Income.find({id:req.params.id});
        return res.status(200).json(data);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({msg:error});

    }
}

exports.getIncome = async function(req,res){
    try {
        const data = await Income.findById(req.params.inc_id);
        if(!data){
            return res.status(404).json({msg:"Not Found"});
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error.message);
        if (error.name=="CastError"){
            return res.status(400).json(error.message);
        }
        return res.status(500).json(error);
        
    }
}