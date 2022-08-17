const router = require("express").Router();
const {
  signUp,
  signIn,
  update,
  updatepassword,
  getUserbyid,
  delete_user,
  verifyEmail,
  verified
} = require("../controllers/user.controllers");
const {
  signUpValidation,
  signInValidation,
  updateValidation,
  updatepasswordvalidation,
} = require("../validation/user.validations");

const authenticateToken = require('../middlewares/authorization')

router.post("/signUp", signUpValidation, signUp);
router.post("/signIn", signInValidation, signIn);
router.get("/:id",authenticateToken, getUserbyid);
router.get("/verify/:id/:string",verifyEmail);
router.get("/verified",verified);
router.delete("/:id", authenticateToken,delete_user);
router.put("/update/:id", updateValidation,authenticateToken, update);
router.put("/updatepassword/:id", updatepasswordvalidation,authenticateToken, updatepassword);

module.exports = router;
