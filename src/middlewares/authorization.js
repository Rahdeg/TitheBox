const JWT = require('jsonwebtoken');
require("dotenv").config();
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET

module.exports = async (req, res, next) => {
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(400).json({msg:"No token found"});
    }

    try {
        let user= JWT.verify(token, ACCESS_SECRET)
         req.user= user.email;
         next();
    } catch (error) {
        return res.status(400).json({msg:"token invalid"});
    }
}