const { array } = require("joi");
const mongoose = require("mongoose")
const churchSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    name:{type:String, required:true},
    serviceDays:[{type:String,required:true}],
    address:{type:String,required:true, default:null},
    subAccountIds:[{type:mongoose.Schema.Types.ObjectId, ref:'SubAccounts', default:null}]
})

exports.Church = mongoose.model('Church',churchSchema);