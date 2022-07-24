const router = require("express").Router();
const { payment, paymentSuccessful } = require("../controllers/payment.controller")

router.get("/paymentSuccess", paymentSuccessful);
router.post('/:id/income/:inc_id/pay', payment);

module.exports = router