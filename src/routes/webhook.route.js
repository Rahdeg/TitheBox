const router = require("express").Router();
const { webhook } = require("../controllers/webhook.controller");

router.post('/',webhook);

module.exports = router;