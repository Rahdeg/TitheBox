const router = require("express").Router();

const {createWallet,getWalett,getWalettTransactions,getWalettBalance,payTithe} = require("../controllers/walett.controller");
const authenticateToken = require('../middlewares/authorization')

router.post("/:id/walett",authenticateToken,createWallet ).get("/:id/walett/:walett_id",getWalett).get("/:id/walett/:walett_id/transanctions",getWalettTransactions).get("/:id/walett/:walett_id/balances",getWalettBalance).post("/:id/income/:income_id/church/:church_id/walett/:walett_id/paytithe",payTithe);

module.exports = router;