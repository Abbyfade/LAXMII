const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["unpaid", "overdue", "paid"],
    default: "unpaid",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
