const router = require("express").Router();
const {signUp, signIn, update, addIncome, getIncomes, getIncome, forgotPassword, verifyCode} = require("../controllers/user.controllers");
const {signUpValidation, signInValidation,updateValidation, incomeValidation} = require("../validation/user.validations");

router.post('/signUp', signUpValidation, signUp);
router.post('/signIn', signInValidation, signIn);
router.post('/signIn/forgotPassword',forgotPassword);
router.post('/signIn/verify',verifyCode)
router.put('/update/:id', updateValidation, update);
router.post('/:id/income',incomeValidation, addIncome);
router.get('/:id/income', getIncomes);
router.get('/:id/income/:inc_id', getIncome);



module.exports = router;