const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inventory: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Quantity cannot be negative
  },
  customerName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
