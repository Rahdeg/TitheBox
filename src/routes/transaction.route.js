const router = require("express").Router();
const {
  getBanks,
  getTransactions,
  getTransaction,
  verifyTransaction,
} = require("../controllers/transactions.controller");

router.get("/:id/banks", getBanks);
router.get("/:id/transactions", getTransactions);
router.get("/:id/transactions/:tran_id", getTransaction);
router.get("/:id/transactions/:tran_id/verify",verifyTransaction);

module.exports = router;
