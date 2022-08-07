const router = require("express").Router();
const {
  getBanks,
  getTransactions,
  getTransaction,
} = require("../controllers/transactions.controller");

router.get("/:id/banks", getBanks);
router.get("/:id/transactions", getTransactions);
router.get("/:id/transactions/:tran_id", getTransaction);

module.exports = router;
