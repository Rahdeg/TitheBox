const mongoose = require("mongoose")
const subaccoutSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    subaccountid:{type:String, required:true},
    subaccountid:{type:String, required:true},
    subaccountid:{type:String, required:true},
    
},{
    timestamps:true
})

exports.Subaccount = mongoose.model('subaccount', subaccoutSchema)