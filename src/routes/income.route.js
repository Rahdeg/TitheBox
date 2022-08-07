const router = require("express").Router();
const { incomeValidation } = require("../validation/user.validations");
const {
  addIncome,
  getIncomes,
  getIncome,
  updateIncome,
  delete_income,
} = require("../controllers/income.controllers");

router.post("/:id/income", incomeValidation, addIncome);
router.get("/:id/income", getIncomes);
router.get("/:id/income/:inc_id", getIncome);
router.put("/:id/income/:inc_id", updateIncome);
router.delete("/:id/income/:inc_id", delete_income);

module.exports = router;
