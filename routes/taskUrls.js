const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const taskController = require("../controllers/taskController");

// Protect task routes with JWT authentication
router.post("/create", authMiddleware, taskController.createTask);
router.get("/", authMiddleware, taskController.getAllTasks);
router.get("/:taskId", authMiddleware, taskController.getTaskById);
router.put("/update/:taskId", authMiddleware, taskController.updateTask);
router.delete("/delete/:taskId", authMiddleware, taskController.deleteTask);

module.exports = router;