const Expense = require("../models/Expense");

// CREATE Expense
exports.createExpense = async (req, res) => {
  try {
    const { expenseType, amount, supplierName, createdAt } = req.body;

    const newExpense = new Expense({
      user: req.user.id,
      expenseType,
      amount,
      supplierName,
      createdAt
    });

    const savedExpense = await newExpense.save();
    res.status(201).json({status: true, message: "Expense created successfully", savedExpense});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error creating Expense", error: err.message });
  }
};

// READ all expenses
exports.getAllExpense = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    const expenses = await Expense.find(filter).sort({ createdAt: -1 });
    res.status(200).json({status: true, expenses});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching expenses", error: err.message });
  }
};

// READ a single expense item by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ status: false, message: "Expense not found" });
    }

    res.status(200).json({status: true, expense});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching expense", error: err.message });
  }
};
