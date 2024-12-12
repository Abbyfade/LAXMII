const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const expenseController = require("../controllers/expenseController");


router.post("/create", authMiddleware, expenseController.createExpense);
router.get("/", authMiddleware, expenseController.getAllExpense);
router.get("/:id", authMiddleware, expenseController.getExpenseById);

module.exports = router;
