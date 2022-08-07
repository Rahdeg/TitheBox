const router = require("express").Router();
const {
  forgotPassword,
  verifyCode,
} = require("../controllers/recovery.controller");

router.post("/signIn/forgotPassword", forgotPassword);
router.post("/signIn/verify", verifyCode);

module.exports = router;
