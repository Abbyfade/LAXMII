const cron = require("node-cron");
const Invoice = require("../models/Invoice");

// Schedule the job to run daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running overdue invoice update job...");

  try {
    const now = new Date();

    // Find invoices that are unpaid and past their due date
    const overdueInvoices = await Invoice.updateMany(
      { status: "unpaid", dueDate: { $lt: now } },
      { $set: { status: "overdue" } }
    );

    console.log(`Overdue invoices updated: ${overdueInvoices.modifiedCount}`);
  } catch (err) {
    console.error("Error updating overdue invoices:", err);
  }
});
