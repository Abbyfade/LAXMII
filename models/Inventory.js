const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, // Quantity cannot be negative
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
