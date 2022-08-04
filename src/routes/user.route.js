const router = require("express").Router();
const {signUp,signIn,update,addIncome,getIncomes,getIncome,updateIncome,forgotPassword,verifyCode,updatepassword,getUserbyid,delete_user,delete_income, getBanks,
addChurch, getChurches, getChurch, updateChurch, deleteChurch, getChurchAccounts, getChurchAccount,
getTransactions, getTransaction} = require("../controllers/user.controllers");
const {signUpValidation, signInValidation,updateValidation, incomeValidation,updatepasswordvalidation, churchValidation} = require("../validation/user.validations");
const { payment } = require("../controllers/payment.controller")

router.post('/signUp', signUpValidation, signUp);
router.post('/signIn', signInValidation, signIn);
router.get('/:id',  getUserbyid);
router.delete('/:id',delete_user);
router.get('/:id/banks',getBanks);
router.post('/:id/churches', churchValidation, addChurch);
router.get('/:id/churches', getChurches);
router.get('/:id/churches/:church_id', getChurch);
router.put('/:id/churches/:church_id', updateChurch);
router.delete('/:id/churches/:church_id', deleteChurch);
router.get('/:id/churches/:church_id/accounts', getChurchAccounts);
router.get('/:id/churches/:church_id/accounts/:acc_id', getChurchAccount);
router.post('/signIn/forgotPassword',forgotPassword);
router.post('/signIn/verify',verifyCode)
router.put('/update/:id', updateValidation, update);
router.put('/updatepassword/:id', updatepasswordvalidation, updatepassword);
router.get('/:id/transactions', getTransactions);
router.get('/:id/transactions/:tran_id', getTransaction);
router.post('/:id/income',incomeValidation, addIncome);
router.get('/:id/income', getIncomes);
router.get('/:id/income/:inc_id', getIncome);
router.put('/:id/income/:inc_id', updateIncome);
router.delete('/:id/income/:inc_id', delete_income)
router.post('/:id/income/:inc_id/pay/church/:church_id/accounts/:acc_id', payment);




module.exports = router;