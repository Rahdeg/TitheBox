const router = require("express").Router();
const { payment, paymentSuccessful , tester} = require("../controllers/payment.controller")

router.get('/:id/test', tester);
router.get("/paymentSuccess", paymentSuccessful);
router.post('/:id/income/:inc_id/pay', payment);
module.exports = router