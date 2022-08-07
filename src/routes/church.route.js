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

router.post("/:id/churches", churchValidation, addChurch);
router.get("/:id/churches", getChurches);
router.get("/:id/churches/:church_id", getChurch);
router.put("/:id/churches/:church_id", updateChurch);
router.delete("/:id/churches/:church_id", deleteChurch);
router.get("/:id/churches/:church_id/accounts", getChurchAccounts);
router.get("/:id/churches/:church_id/accounts/:acc_id", getChurchAccount);

module.exports = router;
