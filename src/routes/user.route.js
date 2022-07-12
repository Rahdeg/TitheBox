const router = require("express").Router();
const {signUp, signIn,update} = require("../controllers/user.controllers");
const {signUpValidation, signInValidation,updateValidation} = require("../validation/user.validations");

router.post('/signUp', signUpValidation, signUp);
router.post('/signIn', signInValidation, signIn);
router.put('/update/:id', updateValidation, update);



module.exports = router;