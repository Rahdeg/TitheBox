const mongoose = require("mongoose")
const churchSchema = new mongoose.Schema({
    name:{type:String, required:true},
    serviceDays:[{type:String,required:true}],
    address:{type:String,required:true, default:null},
    bankName:{type:String, required:true},
    accountNumber:{type:String, required:true},
    subAccountId:{type:String, default:null}
})
const userSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    phoneNumber:{type:String, default:null},
    email:{type:String, required:true},
    occupation:{type:String, default:null},
    city:{type:String, default:null},
    churches:[churchSchema],
    country:{type:String, defailt:null},
    password:{type:String, required:true, select:false},
    token:{type:String},
    code:{type:String}

},{
    timestamps:true
})


exports.User = mongoose.model('Users', userSchema)