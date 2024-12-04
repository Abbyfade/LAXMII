const Inventory = require("../models/Inventory");

// CREATE Inventory
exports.createInventory = async (req, res) => {
  try {
    const { productName, description, quantity, sellingPrice, costPrice } = req.body;

    const newInventory = new Inventory({
      user: req.user.id,
      productName,
      description,
      quantity,
      sellingPrice,
      costPrice,
    });

    const savedInventory = await newInventory.save();
    res.status(201).json({status: true, savedInventory});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error creating inventory", error: err.message });
  }
};

// READ all inventory items
exports.getAllInventory = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    const inventory = await Inventory.find(filter).sort({ createdAt: -1 });
    res.status(200).json({status: true, inventory});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching inventory", error: err.message });
  }
};

// READ a single inventory item by ID
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ status: False, message: "Inventory not found" });
    }

    res.status(200).json({status: True, inventory});
  } catch (err) {
    res.status(500).json({ status: False, message: "Error fetching inventory", error: err.message });
  }
};

// UPDATE an inventory item
exports.updateInventory = async (req, res) => {
  try {
    const { productName, description, quantity, sellingPrice, costPrice } = req.body;

    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { productName, description, quantity, sellingPrice, costPrice },
      { new: true, runValidators: true }
    );

    if (!updatedInventory) {
      return res.status(404).json({ status: False, message: "Inventory not found" });
    }

    res.status(200).json({status: True, updatedInventory});
  } catch (err) {
    res.status(500).json({ status: False, message: "Error updating inventory", error: err.message });
  }
};

// DELETE an inventory item
exports.deleteInventory = async (req, res) => {
  try {
    const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!deletedInventory) {
      return res.status(404).json({ status: False, message: "Inventory not found" });
    }

    res.status(200).json({ status: True, message: "Inventory deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: False, message: "Error deleting inventory", error: err.message });
  }
};
