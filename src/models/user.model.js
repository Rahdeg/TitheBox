const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String},
    phoneNumber:{type:String, default:null},
    email:{type:String, required:true},
    occupation:{type:String, default:null},
    city:{type:String, default:null},
    country:{type:String, defailt:null},
    password:{type:String, required:true, select:false},
    token:{type:String},
    code:{type:String},
    verified:{type:Boolean}


},{
    timestamps:true
})


exports.User = mongoose.model('Users', userSchema)