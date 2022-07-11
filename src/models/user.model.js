const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    phoneNumber:{type:String, default:null},
    email:{type:String, required:true},
    occupation:{type:String, default:null},
    city:{type:String, default:null},
    church:{type:String, default:null},
    serviceDays:[{type:String}],
    country:{type:String, defailt:null},
    password:{type:String, required:true, select:false}

},{
    timestamps:true
})


exports.User = mongoose.model('Users', userSchema)