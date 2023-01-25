const mongoose = require('mongoose');
require("dotenv").config()
const port = process.env.PORT || 5000;
const connectDatabase = async function(app){
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(process.env.DB_URI,{dbName: process.env.DB_NAME}, ()=>{
            console.log("Database Connected");
            app.listen(port, ()=>{
                console.log(`Server listening on ${port}`);
            });
        });
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {connectDatabase};