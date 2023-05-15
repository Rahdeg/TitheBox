const router = require("express").Router();

const {createWallet,getWalett,getWalettTransactions,getWalettBalance,payTithe,otherTransfers} = require("../controllers/walett.controller");
const authenticateToken = require('../middlewares/authorization')

router.post("/:id/walett",authenticateToken,createWallet )
router.get("/:id/walett/:walett_id",authenticateToken,getWalett)
router.get("/:id/walett/:walett_id/transanctions",authenticateToken,getWalettTransactions)
router.get("/:id/walett/:walett_id/balances",authenticateToken,getWalettBalance)
router.post("/:id/income/:income_id/church/:church_id/walett/:walett_id/paytithe",authenticateToken,payTithe)
router.post("/:id/church/:church_id/walett/:walett_id/transfers",otherTransfers);

module.exports = router;