const router = require("express").Router();
const { webhook } = require("../controllers/webhook.controller");

router.post('/webhooks',webhook);

module.exports = router;