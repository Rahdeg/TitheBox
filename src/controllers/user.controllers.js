const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model").User;
const {Church} = require("../models/church.model");
const {Income} = require("../models/income.model");
const { senddetails } = require("../utils/functions");
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
      const user = new User(data);
      user.token = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET);
      user.save((error, user) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ msg: "User Not Saved" });
        } else if (user) {
          senddetails(data);
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
  if (!user) {
    return res.status(404).json({ msg: "Invalid Credentials" });
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
};

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
