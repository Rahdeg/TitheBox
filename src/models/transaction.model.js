const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    flw_tran_id:{type:String,default:null},

    amount:{type:Number, required:true, default: 0},

    type:{type: String, required:true },

    balance:{type:Number, required:true},
    status:{type:String, default:"pending"}
},{
    timestamps:true
});

exports.Transaction = mongoose.model('Transactions', transactionSchema);