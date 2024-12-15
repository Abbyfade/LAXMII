const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { 
  createInvoice, 
  getInvoices, 
  getInvoiceById,
  updateInvoiceStatus,
} = require("../controllers/invoiceController");
const router = express.Router();

router.post("/create", authMiddleware, createInvoice); // Create a new invoice
router.get("/", authMiddleware, getInvoices); // Fetch invoices with optional filters
router.get("/:id", authMiddleware, getInvoiceById);
router.put("/:id/status", authMiddleware, updateInvoiceStatus); // Update status to "paid"

module.exports = router;
