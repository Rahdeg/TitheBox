const router = require("express").Router();

const {createWallet} = require("../controllers/walett.controller");
const authenticateToken = require('../middlewares/authorization')

router.post("/:id/walett",authenticateToken,createWallet );

module.exports = router;