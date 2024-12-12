const Expense = require("../models/Expense");
const Sales = require("../models/Sales");

exports.getAllTransactions = async (req, res) => {
    try {
        // Fetch all expenses and sales from the database
        const expenses = await Expense.find({ user: req.user.id });
        const sales = await Sales.find({ user: req.user.id });

        // Format expenses with an additional 'type' field
        const formattedExpenses = expenses.map(expense => ({
            _id: expense._id,
            type: 'expense', 
            transactionType: 'money_out', 
            expenseType: expense.expenseType, 
            amount: expense.amount,
            supplierName: expense.supplierName, 
            createdAt: expense.createdAt
        }));

        // Format sales with an additional 'type' field
        const formattedSales = sales.map(sale => ({
            _id: sale._id,
            type: 'sales', 
            transactionType: 'money_in', 
            inventory: sales.inventory, 
            amount: sale.amount,
            customerName: sale.customerName, 
            createdAt: sale.createdAt
        }));

        // Combine expenses and sales into a single list
        const transactions = [...formattedExpenses, ...formattedSales];

        // Sort transactions by creation date (most recent first)
        transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Return the combined transactions
        res.status(200).json({status: true, transactions});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Error fetching transactions", error: err.message });
    }
};


