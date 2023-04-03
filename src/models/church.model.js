const mongoose = require("mongoose")
const churchSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    name:{type:String, required:[true, "Please add a name"]},
    serviceDays:[{type:String,required:[true, "Please add a service day"]}],
    address:{type:String,required:[true, "Please add an address"], default:null},
    accountName:{type:String,required:[true, "Please add an account name"]},
    accountNumber:{type:String,required:[true, "Please add an account number"]},
    country:{type:String,required:[true, "Please add a country"]},
    bank:{
        code:{type:String,required:[true, "Please add a bank code"]},
        name:{type:String,required:[true, "Please add a bank name"]},
    },
    
})

exports.Church = mongoose.model('Church',churchSchema);