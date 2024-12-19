const express = require('express');
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');  // Import Invoice Model
const Expense = require('../models/Expense');  // Import Expense Model

const router = express.Router();

// Helper function to get the start of the day for a date
const startOfDay = (date) => {
  return new Date(date.setHours(0, 0, 0, 0));
};

// Helper function to get the day of the week name
const getDayName = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Helper function to get the month name
const getMonthName = (date) => {
  return date.toLocaleDateString('en-US', { month: 'long' });
};

// Helper function to get date range for the last 12 months
const getLast12Months = () => {
  const today = new Date();
  const result = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push({
      start: startOfDay(new Date(date.getFullYear(), date.getMonth(), 1)),
      end: startOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
      monthName: getMonthName(date),
    });
  }
  
  return result;
};

// Helper function to get date range for the last 7 days
const getLast7Days = () => {
  const today = startOfDay(new Date());
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    result.push({
      start: startOfDay(date),
      end: startOfDay(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)),
      dayName: getDayName(date),
    });
  }
  
  return result;
};

// Function to aggregate data for a given date range
const aggregateData = async (Model, dateRanges) => {
  const promises = dateRanges.map(async ({ start, end }) => {
    const data = await Model.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" || "$amount" },
        },
      },
    ]);

    return data.length > 0 ? data[0].totalAmount : 0;
  });

  return Promise.all(promises);
};

// Single endpoint for fetching invoice and expense totals
router.get('/summary', async (req, res) => {
  const { queryBy } = req.query; // Expecting 'year' or 'week'

  try {
    let dateRanges = [];
    let periodType = ''; // Will store either 'month' or 'day' based on the query

    if (queryBy === 'year') {
      // Get data for the last 12 months
      dateRanges = getLast12Months();
      periodType = 'month';
    } else if (queryBy === 'week') {
      // Get data for the last 7 days
      dateRanges = getLast7Days();
      periodType = 'day';
    } else {
      return res.status(400).json({ error: "Invalid query parameter. Use 'year' or 'week'." });
    }

    // Aggregate invoice and expense data
    const invoices = await aggregateData(Invoice, dateRanges);
    const expenses = await aggregateData(Expense, dateRanges);

    // Structuring the result
    const result = {};
    dateRanges.forEach((range, index) => {
      const periodName = periodType === 'month' ? range.monthName : range.dayName;
      result[periodName] = {
        invoice: invoices[index],
        expense: expenses[index],
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

module.exports = router;
