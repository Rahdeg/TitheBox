const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model").User;
const {Church} = require("../models/church.model");
const {Income} = require("../models/income.model");
const { senddetails, revalidateAccount } = require("../utils/functions");
const path = require('path')
const {Userverification} = require ('../models/userverification.model')
require("dotenv").config();
const salt = parseInt(process.env.SALT);
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.signUp = async function (req, res) {
  try {
    const data = req.body;
    const email_exists = await User.findOne({ email: data.email });
    if (email_exists) {
      return res.status(400).json({ msg: "email already exists" });
    }
    bcrypt.hash(data.password, salt, (err, hash) => {
      if (err) {
        return res.status(500).json({ msg: err });
      }
      if (hash) {
        data.password = hash;
      }
      data.verified = false; 
      const user = new User(data);
      user.token = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET);
      user.save((error, user) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ msg: "User Not Saved" });
        } else if (user) {
          senddetails(user);
          return res.status(201).json(user);
        }
      });
    });
  } catch {
    console.log(error);
  }
};
exports.signIn = async function (req, res) {
  const data = req.body;
  const user = await User.findOne({ email: data.email }).select("+password");
  //check if user exist
  if (!user) {
    return res.status(404).json({ msg: "Invalid Credentials" });
  } else {
    // check if user is verified
    if (!user.verified) {
      return res.status(400).json({ msg: "Email has not been Verified" });
    } else {
      bcrypt.compare(data.password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ msg: err });
        }
        if (!result) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        } else {
          user.token = jwt.sign(
            { id: user._id, email: user.email },
            ACCESS_SECRET
          );
          return res.status(200).json(user);
        }
      });
    }
   
  }
};

exports.verifyEmail= async (req,res)=>{
  let {id,string}= req.params;
  Userverification.find({ user_id: id })
  .then((result)=>{
    //user exist
    if (result.length > 0) {
      const {expiresAt}=result[0];
      const hashedString=result[0].uniqueString;
      //checking for expired link
      if (expiresAt < Date.now()) {
        //recored expired so we delete it
        // Userverification.deleteOne({user_id: id })
        // .then(result=>{
        //   User.deleteOne({_id: id})
        //   .then(()=>{
        //     let message= "Link has expired please sign up again";
        //     res.redirect(`/users/verified/error=true&message=${message}`); 
        //   })
        //   .catch(()=>{
        //   let message= "Clearing user with expired unique string failed";
        //   res.redirect(`/users/verified/error=true&message=${message}`);
        //   })
        // }).catch((error)=>{
        //   console.log(error)
        //   let message= "An error occurred while clearing expired user verification record";
        //   res.redirect(`/users/verified/error=true&message=${message}`);
        // })
        console.log("Verification Expired Please revalidate using your email" )
        let message= "Verification Expired Please revalidate using your email";
        res.redirect(`/users/verified/error=true&message=${message}`); 
        
        
        
      }else{
        //valid record exist so we validate user
        //compare hashed uniquestring
        bcrypt.compare(string,hashedString)
        .then((result)=>{
          if (result) {
            //string matched
            User.updateOne({_id:id},{verified:true})
            .then(()=>{
             Userverification.deleteOne({user_id:id})
             .then(()=>{
                res.sendFile(path.join(__dirname,"../views/verified.html"));
             })
             .catch((error)=>{
              console.log(error)
              let message= `An error occured while finalizing successful verification`;
              res.redirect(`/users/verified/error=true&message=${message}`);
             })
            })
            .catch((error)=>{
              console.log(error)
              let message= `An error occured while updating user record to show verified`;
              res.redirect(`/users/verified/error=true&message=${message}`);
            })

          } else {
            //existing record incorrect verification details passed
            let message= `Invalid verification details passed.Check your inbox.`;
          res.redirect(`/users/verified/error=true&message=${message}`);
          }
        })
        .catch(()=>{
          let message= `An error occured while comparing unique strings`;
          res.redirect(`/users/verified/error=true&message=${message}`);
        })
      }
    } else {
    let message= `Account record does'nt exist or has been verified already.Please sign up or log in`;
    res.redirect(`/users/verified/error=true&message=${message}`);
    }
  })
  .catch((error)=>{
    console.log(error)
    let message= "An error occurred while checking for existing user verification records";
    res.redirect(`/users/verified/error=true&message=${message}`);
  })
}

exports.revalidate= async (req,res)=>{
  try {
    const {email} = req.body;
  const user = await User.findOne({ email });
 
if (user.verified) {
  return res.status(404).json({ msg: ` user with email ${email} as been verified` });
}
  revalidateAccount(user);
  
  } catch (error) {
    return res.status(400).json(error);
  }
  
}




exports.verified= async (req,res)=>{
  res.sendFile(path.join(__dirname,"../views/verified.html"))
}

exports.getUserbyid = async (req, res) => {
  User.findById(req.params.id, (err, data) => {
    // data = filterOutPasswordField(data);
    if (err) {
      return res.status(400).send({ success: false, msg: "user not found" });
    }

    if (data) {
      return res.status(200).send({ success: true, user: data._doc });
    }
  });
};

exports.update = async (req, res) => {
  const user = req.body;
  User.findByIdAndUpdate(req.params.id, user, { new: true }, (err, data) => {
    if (data) {
      return res.status(200).send({ success: true, updated: data });
    }
    if (err) {
      return res.status(400).send({ success: false, msg: "user not found" });
    }
  });
};

exports.delete_user = async function (req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: `No user with id ${req.params.id}` });
    } else {
      await Income.deleteMany({ user_id: req.params.id });
      await Church.deleteMany({ user_id: req.params.id });
      return res
        .status(200)
        .json({ msg: "User Deleted Successfully", data: null });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured" });
  }
};

exports.updatepassword = async (req, res) => {
  const data = req.body;
  const email_exists = await User.findOne({ email: data.email });
  if (!email_exists) {
    return res.status(400).json({ msg: "email does not exists" });
  }
  bcrypt.hash(data.password, salt, (err, hash) => {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    if (hash) {
      data.password = hash;
      User.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true },
        (err, data) => {
          if (data) {
            return res.status(200).send({ success: true, updated: data });
          }
          if (err) {
            return res
              .status(400)
              .send({ success: false, msg: "user not found" });
          }
        }
      );
    }
  });
};
