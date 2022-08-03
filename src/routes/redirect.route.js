const router = require("express").Router();
const { paymentSuccessful , tester} = require("../controllers/payment.controller")

router.get("/paymentSuccess", paymentSuccessful);
router.get('users/:id/test', tester);

module.exports = router