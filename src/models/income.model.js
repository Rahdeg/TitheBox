const mongoose = require("mongoose")
const incomeSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    type:{type:String, required:true},
    currency:{type:String, required:true},
    businessName:{type:String, required:true},
    businessAddress:{type:String, required:true},
    amount:{type:Number, required:true},
    description:{type:String, default:null},
    tithePercentage:{type:Number, min:10, max:100, required:true},
    frequency:{type:String, required:true},

},{
    timestamps:true
})

exports.Income = mongoose.model('Incomes', incomeSchema)