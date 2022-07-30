const router = require("express").Router();
const {signUp,signIn,update,addIncome,getIncomes,getIncome,updateIncome,forgotPassword,verifyCode,updatepassword,getUserbyid,delete_user,delete_income, getBanks,
addChurch, getChurches, getChurch, updateChurch, deleteChurch} = require("../controllers/user.controllers");
const {signUpValidation, signInValidation,updateValidation, incomeValidation,updatepasswordvalidation} = require("../validation/user.validations");

router.post('/signUp', signUpValidation, signUp);
router.post('/signIn', signInValidation, signIn);
router.get('/:id',  getUserbyid);
router.delete('/:id',delete_user);
router.get('/:id/banks',getBanks);
router.post('/:id/churches', addChurch);
router.get('/:id/churches', getChurches);
router.get('/:id/churches/:church_id', getChurch);
router.put('/:id/churches/:church_id', updateChurch);
router.delete('/:id/churches/:church_id', deleteChurch);
router.post('/signIn/forgotPassword',forgotPassword);
router.post('/signIn/verify',verifyCode)
router.put('/update/:id', updateValidation, update);
router.put('/updatepassword/:id', updatepasswordvalidation, updatepassword);
router.post('/:id/income',incomeValidation, addIncome);
router.get('/:id/income', getIncomes);
router.get('/:id/income/:inc_id', getIncome);
router.put('/:id/income/:inc_id', updateIncome);
router.delete('/:id/income/:inc_id', delete_income)




module.exports = router;