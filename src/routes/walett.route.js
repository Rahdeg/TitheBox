const router = require("express").Router();

const {createWallet,getWalettBalance,} = require("../controllers/walett.controller");
const {createAwallet,payTithe,otherTransfers,getAWalett,getWalettTransactions} = require('../controllers/virtualWalett.controllers')
const authenticateToken = require('../middlewares/authorization')

router.post("/:id/walett",authenticateToken,createAwallet )
router.get("/:id/walett",authenticateToken,getAWalett)
router.get("/:id/walett/:walett_id",authenticateToken,getWalettTransactions)
router.get("/:id/walett/:walett_id/balances",authenticateToken,getWalettBalance)
router.post("/:id/income/:income_id/church/:church_id/walett/:walett_id/paytithe",authenticateToken,payTithe)
router.post("/:id/church/:church_id/walett/:walett_id/transfers",otherTransfers);
// router.post('/walett',createAwallet)
// router.get('/:id/walett',getAWalett)

module.exports = router;