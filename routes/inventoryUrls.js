const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const inventoryController = require("../controllers/inventoryController");


router.post("/create", authMiddleware, inventoryController.createInventory);
router.get("/", authMiddleware, inventoryController.getAllInventory);
router.get("/:id", authMiddleware, inventoryController.getInventoryById);
router.put("/update/:id", authMiddleware, inventoryController.updateInventory);
router.delete("/delete/:id", authMiddleware, inventoryController.deleteInventory);

module.exports = router;
