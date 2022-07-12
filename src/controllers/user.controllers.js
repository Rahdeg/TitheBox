const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model").User;
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