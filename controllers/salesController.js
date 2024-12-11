const Sales = require("../models/Sales");

// CREATE Sales
exports.createSales = async (req, res) => {
  try {
    const { inventory, amount, customerName, createdAt } = req.body;

    const newSales = new Sales({
      user: req.user.id,
      inventory,
      amount,
      customerName,
      createdAt
    });

    const savedSales = await newSales.save();
    res.status(201).json({status: true, message: "Sales created successfully", savedSales});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error creating Sales", error: err.message });
  }
};

// READ all sales items
exports.getAllSales = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    const sales = await Sales.find(filter).sort({ createdAt: -1 });
    res.status(200).json({status: true, sales});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching sales", error: err.message });
  }
};

// READ a single sales item by ID
exports.getSalesById = async (req, res) => {
  try {
    const sales = await Sales.findById(req.params.id);

    if (!sales) {
      return res.status(404).json({ status: false, message: "Sales not found" });
    }

    res.status(200).json({status: true, sales});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching sales", error: err.message });
  }
};
