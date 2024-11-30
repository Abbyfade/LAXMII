const Invoice = require("../models/Invoice");

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
    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      res.json({ invoices });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params; // Invoice ID
        const { status } = req.body;

        if (!["paid"].includes(status)) {
        return res.status(400).json({ message: "Invalid status update" });
        }

        const invoice = await Invoice.findById(id);

        if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
        }

        // Update the status
        invoice.status = status;
        await invoice.save();

        res.json({ message: "Invoice status updated", invoice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
  