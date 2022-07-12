const express = require('express');
const cors = require('cors')
const {connectDatabase} = require("./src/config/database");
const user_route = require("./src/routes/user.route")

const app = express();
connectDatabase(app);
app.use(cors())
app.use(express.json())
app.use('/api/v1/users', user_route)

app.get('/', (req,res)=>{
    res.status(200).json({msg:"Welcome to the api for the tithe box app"})
})

app.all("*", (req, res) => {
    res.send({
      status: false,
      messsage: "Oops! you've hitted an invalid route.",
    });
  });