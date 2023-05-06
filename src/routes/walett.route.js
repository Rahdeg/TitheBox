const router = require("express").Router();

const {createWallet,getWalett,getWalettTransactions,getWalettBalance,payTithe,otherTransfers} = require("../controllers/walett.controller");
const authenticateToken = require('../middlewares/authorization')

router.post("/:id/walett",authenticateToken,createWallet ).get("/:id/walett/:walett_id",authenticateToken,getWalett).get("/:id/walett/:walett_id/transanctions",authenticateToken,getWalettTransactions).get("/:id/walett/:walett_id/balances",authenticateToken,getWalettBalance).post("/:id/income/:income_id/church/:church_id/walett/:walett_id/paytithe",authenticateToken,payTithe).post("/:id/income/:income_id/church/:church_id/walett/:walett_id/transfers",otherTransfers);

module.exports = router;