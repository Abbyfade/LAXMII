const Invoice = require("../models/Invoice");
const crypto = require("crypto");

exports.createInvoice = async (req, res) => {
  try {
    const { customerName, invoiceNumber, issueDate, dueDate, items } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const invoice = new Invoice({
      user: req.user.id,
      customerName,
      invoiceNumber,
      issueDate,
      dueDate,
      items,
      totalAmount,
    });

    await invoice.save();
    res.status(201).json({ status: true, message: "Invoice created successfully", invoice });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};


exports.getInvoices = async (req, res) => {
    try {
      const { status } = req.query; // Optional filter for status (unpaid, overdue, paid)
      const filter = { user: req.user.id };
  
      // Add status filter if provided
      if (status) {
        filter.status = status;
      }
  
      // Fetch invoices
      const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
      res.status(201).json({ status: true, invoices });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  };

// READ a single invoice item by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ status: false, message: "Invoice not found" });
    }

    res.status(200).json({status: true, invoice});
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching invoice", error: err.message });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params; // Invoice ID
        const { status } = req.body;

        if (!["paid"].includes(status)) {
        return res.status(400).json({ status: false, message: "Invalid status update" });
        }

        const invoice = await Invoice.findById(id);

        if (!invoice) {
        return res.status(404).json({ status: false, message: "Invoice not found" });
        }

        // Update the status
        invoice.status = status;
        await invoice.save();

        res.status(201).json({ status: true, message: "Invoice status updated", invoice });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};
  
function createRandomInvoiceNumber() {
  return `#${crypto.randomInt(10000, 99999)}`; // Example: INV-123456
}

// Controller to generate unique invoice number
exports.generateInvoiceNumber = async (req, res) => {
  try {
      let isUnique = false;
      let invoiceNumber;

      // Loop until a unique invoice number is generated
      while (!isUnique) {
          invoiceNumber = createRandomInvoiceNumber();
          const existingInvoice = await Invoice.findOne({ invoiceNumber });

          if (!existingInvoice) {
              isUnique = true;
          }
      }

      // Return the unique invoice number
      res.status(200).json({
          status: true,
          invoiceNumber: invoiceNumber
      });

  } catch (error) {
      console.error('Error generating invoice number:', error.message);
      res.status(500).json({
          status: false,
          message: 'Server error while generating invoice number'
      });
  }
};