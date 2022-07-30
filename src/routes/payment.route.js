const router = require("express").Router();
const { payment, paymentSuccessful , tester} = require("../controllers/payment.controller")

router.get("/paymentSuccess", paymentSuccessful);
router.get('/:id/test', tester);
router.post('/:id/income/:inc_id/pay/church/:church_id', payment);
module.exports = router