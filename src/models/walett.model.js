const mongoose = require("mongoose")
const walettSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    id:{type:String, required:[true, "Please add an id"]},
    accountReference:{type:String, required:[true, "Please add a reference"]},
    accountName:{type:String, required:[true, "Please add a account name"]},
    barterId:{type:String, required:[true, "Please add a barterId"]},
    email:{type:Number, required:[true, "Please add an barterId"]},
    mobileNumber:{type:String, required:[true, "Please add a mobileNumber"]},
    nuban:{type:String, required:[true, "Please add a nuban"]},
    bankName:{type:Number, required:[true, "Please add a bankName"]},
    bankCode:{type:String, required:[true, "Please add a bankCode"]},
    status:{type:String, required:[true, "Please add a status"]},
    
},{
    timestamps:true
})

exports.Walett = mongoose.model('Waletts', walettSchema)