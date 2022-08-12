const router = require("express").Router();
const { churchValidation } = require("../validation/user.validations");
const {
  addChurch,
  getChurches,
  getChurch,
  updateChurch,
  deleteChurch,
  getChurchAccounts,
  getChurchAccount,
} = require("../controllers/church.controllers");

const authenticateToken = require('../middlewares/authorization')

router.post("/:id/churches", churchValidation,authenticateToken, addChurch);
router.get("/:id/churches",authenticateToken, getChurches);
router.get("/:id/churches/:church_id",authenticateToken, getChurch);
router.put("/:id/churches/:church_id",authenticateToken, updateChurch);
router.delete("/:id/churches/:church_id",authenticateToken, deleteChurch);
router.get("/:id/churches/:church_id/accounts",authenticateToken, getChurchAccounts);
router.get("/:id/churches/:church_id/accounts/:acc_id",authenticateToken, getChurchAccount);

module.exports = router;
