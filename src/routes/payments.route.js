const router = require("express").Router();
const { payment } = require("../controllers/payment.controller");

router.post(
  "/:id/income/:inc_id/pay/church/:church_id/accounts/:acc_id",
  payment
);

module.exports = router;
