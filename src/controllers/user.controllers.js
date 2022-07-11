const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const salt = process.env.SALT;
const ACCESS_SECRET = process.env.ACCESS_SECRET

exports.signUp = async function(req,res){
    const data = req.body;
    const email_exists = User.findOne({email:data.email});
    if(email_exists){
        return res.status(400).json({msg:"email already exists"});
    }
    const user = new User(data);
    user.save();
    return res.status(201).json(user);
};
exports.signIn = async function(req,res){
    const data = req.body;
    const user = User.findOne({email:data.email}).select("+password");
    if(!user){
        return res.status(404).json({msg:"Invalid Credentials"})
    }else{
        
    }
};