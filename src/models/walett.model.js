const mongoose = require("mongoose")
const walettSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    orderRef:{type:String, required:[true, "Please add a reference"]},
    flwRef:{type:String, required:[true, "Please add a reference"]},
    email:{type:String, required:[true, "Please add an barterId"]},
    mobileNumber:{type:String, required:[true, "Please add a mobileNumber"]},
    accountNumber:{type:String, required:[true, "Please add an account number"]},
    accountName:{type:String, required:[true, "Please add an account name"]},
    bankName:{type:String, required:[true, "Please add a bankName"]},
    balance:{type: Number, default:0},
    
},{
    timestamps:true
})

exports.Walett = mongoose.model('Waletts', walettSchema)