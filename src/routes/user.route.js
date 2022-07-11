const router = require("express").Router();
const {signUp, signIn} = require("../controllers/user.controllers");
const {signUpValidation, signInValidation} = require("../validation/user.validations");

router.post('/signUp', signUpValidation, signUp);
router.post('/signIn', signInValidation, signIn);

module.exports = router;