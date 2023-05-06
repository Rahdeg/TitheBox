const mongoose = require("mongoose")
const incomeSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    type:{type:String, required:[true, "Please add an income type"]},
    currency:{type:String, required:[true, "Please add a currency"]},
    businessName:{type:String, required:[true, "Please add a business name"]},
    businessAddress:{type:String, required:[true, "Please add a business address"]},
    amount:{type:Number, required:[true, "Please add an income amount"]},
    description:{type:String, default:null},
    tithePercentage:{type:Number, min:10, max:100, required:[true, "Please add tithe percentage"]},
    frequency:{type:String, required:[true, "Please income frequency"]},
},{
    timestamps:true
})

exports.Income = mongoose.model('Incomes', incomeSchema)