const router = require("express").Router();
const {
  signUp,
  signIn,
  update,
  updatepassword,
  getUserbyid,
  delete_user,
} = require("../controllers/user.controllers");
const {
  signUpValidation,
  signInValidation,
  updateValidation,
  updatepasswordvalidation,
} = require("../validation/user.validations");

router.post("/signUp", signUpValidation, signUp);
router.post("/signIn", signInValidation, signIn);
router.get("/:id", getUserbyid);
router.delete("/:id", delete_user);
router.put("/update/:id", updateValidation, update);
router.put("/updatepassword/:id", updatepasswordvalidation, updatepassword);

module.exports = router;
