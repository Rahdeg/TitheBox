const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    income_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Incomes',
        required:true
    },
    amount:{type:Number, required:true},
    church:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Church', 
        required:true
    },
    tithePercentage:{type:Number, required:true},
    currency:{type:String,required:true},
    status:{type:String, default:"pending"}
},{
    timestamps:true
});

exports.Transaction = mongoose.model('Transactions', transactionSchema);