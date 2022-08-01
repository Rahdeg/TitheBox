const mongoose = require("mongoose")
const subAccountSchema = new mongoose.Schema({
    bankName:{type:String, required:true},
    bankCode:{type:String, required:true},
    accountName:{type:String, required:true},
    accountNumber:{type:String, required:true},
    subAccountId:{type:String, default:null}
})

exports.SubAccount = mongoose.model('SubAccount',subAccountSchema);