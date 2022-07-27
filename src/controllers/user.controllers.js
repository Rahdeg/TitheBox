const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model").User;
const {Income} = require("../models/income.model");
const {sendCode, generateCode,senddetails,filterOutPasswordField,createSubAccount,updateSubaccount } = require('../utils/functions')
require("dotenv").config();
const salt = parseInt(process.env.SALT);
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET

exports.signUp = async function(req,res){
    try{
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
        senddetails(data);
        user.save((error,user)=>{
            if(error){
                return res.status(400).json({msg:"User Not Saved"})
            }else if(user){
                createSubAccount(user.id);
                return res.status(201).json(user);
            }
        });
        
    });
    }catch{
        console.log(error)
    }
    
   
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

exports.getUserbyid=async (req,res)=>{
    User.findById(req.params.id,(err,data)=>{
        data = filterOutPasswordField(data);
       if (err) {
           return  res.status(400).send({success:false, msg:'user not found'});
       }
  
       if (data) {
           return  res.status(200).send({success:true, user:data._doc});
       }
   })
  }


exports.update= async (req,res)=>{
const user = req.body;  
updateSubaccount (data);
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


exports.forgotPassword = async function(req,res){
    let codeSend=generateCode(5);
    const {email} = req.body
    const user = await User.findOne({email:email});
    if (!user){
        return res.status(404).json({msg:"User Not Found"})
    }else{
        user.code = codeSend;
        user.save()
        try {
            sendCode(email,codeSend);
            return res.status(200).json({msg:"Code Sent to Email"});
        } catch (error) {
            return res.status(400).json({msg:"Code Not Sent to Email.Please Try Again"});
        }
    }

}

exports.verifyCode = async function(req,res){
    const {email,code} = req.body
    const user = await User.findOne({email:email});
    if (!user){
        return res.status(404).json({msg:"User Not Found"})
    }else{
        if (user.code == code){
            user.code = undefined;
            user.save()
            return res.status(200).json({msg:"Code  is Valid"});
        }else{
            return res.status(400).json({msg:"Invalid Code"});
        }
    }

}

exports.updatepassword= async (req,res)=>{
    const data = req.body;
    const email_exists = await User.findOne({email:data.email});
    if(!email_exists){
        return res.status(400).json({msg:"email does not exists"});
    }
    bcrypt.hash(data.password, salt,(err,hash)=>{
        if(err){
            return res.status(500).json({msg:err})
        }
        if(hash){
           data.password = hash
           User.findByIdAndUpdate(req.params.id,data ,{new:true}, (err, data)=>{
            if (data) {
                return  res.status(200).send({success:true, updated:data}); 
            }
            if (err) {
                return  res.status(400).send({success:false, msg:'user not found'});
            }
        })
    
        }})
    
    }

    exports.delete_user = async function(req,res){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            if(!user){
                return res.status(404).json({msg:`No user with id ${req.params.id}`})
            }else{
                return res.status(200).json({msg:"User Deleted Successfully",data:null})
            }
    
        }catch(error){
            console.log(error)
        }
    
    }
    
    exports.delete_income = async function(req,res){
        try{
            const user = await User.findById(req.params.id)
            const income = await Income.findByIdAndDelete(req.params.inc_id)
            // if(!user){
            //     return res.status(404).json({msg:`No user with id ${req.params.id}`})
            // }
            if(!income){
                return res.status(404).json({msg:`No income with id ${req.params.id}`})
            }else{
                return res.status(200).json({msg:"Income Deleted Successfully",data:null})
            }
    
    
        }catch(error){
            console.log(error)
        }
    
    }