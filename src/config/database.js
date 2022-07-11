const mongoose = require('mongoose');
require("dotenv").config()
const port = process.env.PORT || 5000;
const connectDatabase = async function(app){
    try {
        mongoose.connect(process.env.DB_URI, ()=>{
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