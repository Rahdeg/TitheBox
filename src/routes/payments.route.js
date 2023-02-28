const router = require("express").Router();
const { payment,tester,tester2 } = require("../controllers/payment.controller");

router.post(
  "/:id/income/:inc_id/pay/church/:church_id/accounts/:acc_id",
  payment
);
router.get("/:id/test",tester);

module.exports = router;
