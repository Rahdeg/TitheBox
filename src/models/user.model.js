const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    phoneNumber:{type:String, default:null},
    email:{type:String, required:true},
    occupation:{type:String, default:null},
    city:{type:String, default:null},
    churches:[{type:mongoose.Schema.Types.ObjectId,ref:'Churches',required:true}],
    country:{type:String, defailt:null},
    password:{type:String, required:true, select:false},
    token:{type:String},
    code:{type:String}

},{
    timestamps:true
})


exports.User = mongoose.model('Users', userSchema)