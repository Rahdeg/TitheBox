const router = require("express").Router();
const { churchValidation } = require("../validation/user.validations");
const {
  addChurch,
  getChurches,
  getChurch,
  updateChurch,
  deleteChurch,
} = require("../controllers/church.controllers");

const authenticateToken = require('../middlewares/authorization')

router.post("/:id/churches",authenticateToken, addChurch);
router.get("/:id/churches",authenticateToken, getChurches);
router.get("/:id/churches/:church_id",authenticateToken, getChurch)
router.put("/:id/churches/:church_id",authenticateToken, updateChurch)
router.delete("/:id/churches/:church_id",authenticateToken, deleteChurch);


module.exports = router;
