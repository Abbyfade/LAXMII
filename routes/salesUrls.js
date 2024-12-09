const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const salesController = require("../controllers/salesController");


router.post("/create", authMiddleware, salesController.createSales);
router.get("/", authMiddleware, salesController.getAllSales);
router.get("/:id", authMiddleware, salesController.getSalesById);

module.exports = router;
