const User = require("../models/user.model").User;
const { sendCode, generateCode } = require("../utils/functions");

exports.forgotPassword = async function (req, res) {
  let codeSend = generateCode(5);
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "User Not Found" });
  } else {
    user.code = codeSend;
    user.save();
    try {
      sendCode(email, codeSend);
      return res.status(200).json({ msg: "Code Sent to Email" });
    } catch (error) {
      return res
        .status(400)
        .json({ msg: "Code Not Sent to Email.Please Try Again" });
    }
  }
};

exports.verifyCode = async function (req, res) {
  const { email, code } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "User Not Found" });
  } else {
    if (user.code == code) {
      user.code = undefined;
      user.save();
      return res.status(200).json({ msg: "Code  is Valid" });
    } else {
      return res.status(400).json({ msg: "Invalid Code" });
    }
  }
};
