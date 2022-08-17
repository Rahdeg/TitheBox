const mongoose = require("mongoose")
const verificationSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    uniqueString:{type:String},
    expiresAt:{type:Date},

},{
    timestamps:true
})

exports.Userverification = mongoose.model('userVerification', verificationSchema)