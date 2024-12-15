const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const transactionsController = require("../controllers/transactionsController");


router.get("/", authMiddleware, transactionsController.getAllTransactions);

module.exports = router;