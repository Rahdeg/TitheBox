const router = require("express").Router();
const { payment,tester,tester2 } = require("../controllers/payment.controller");

router.post(
  "/:id/income/:inc_id/pay/church/:church_id/accounts/:acc_id",
  payment
);
router.get("/:id/test",tester)
router.get("/:id/transaction/:tran_id/test",tester2)

module.exports = router;
