const router = require("express").Router();
const { incomeValidation } = require("../validation/user.validations");
const {
  addIncome,
  getIncomes,
  getIncome,
  updateIncome,
  delete_income,
} = require("../controllers/income.controllers");
const authenticateToken = require('../middlewares/authorization')

router.post("/:id/income",authenticateToken, addIncome).get(authenticateToken, getIncomes);
router.get("/:id/income/:inc_id",authenticateToken, getIncome).put(authenticateToken, updateIncome).delete(authenticateToken, delete_income);

module.exports = router;
