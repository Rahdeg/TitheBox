const router = require("express").Router();
const {
  paymentSuccessful,
  tester,
} = require("../controllers/payment.controller");

router.get("/payment/:tran_id", paymentSuccessful);
router.get("/users/:id/test", tester);

module.exports = router;
