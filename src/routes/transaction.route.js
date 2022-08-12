const router = require("express").Router();
const {
  getBanks,
  getTransactions,
  getTransaction,
  verifyTransaction,
} = require("../controllers/transactions.controller");
const authenticateToken = require('../middlewares/authorization')

router.get("/:id/banks",authenticateToken, getBanks);
router.get("/:id/transactions",authenticateToken, getTransactions);
router.get("/:id/transactions/:tran_id",authenticateToken, getTransaction);
router.get("/:id/transactions/:tran_id/verify",authenticateToken,verifyTransaction);

module.exports = router;
