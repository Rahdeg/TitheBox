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

router.post("/:id/income", incomeValidation,authenticateToken, addIncome);
router.get("/:id/income",authenticateToken, getIncomes);
router.get("/:id/income/:inc_id",authenticateToken, getIncome);
router.put("/:id/income/:inc_id",authenticateToken, updateIncome);
router.delete("/:id/income/:inc_id",authenticateToken, delete_income);

module.exports = router;
