const Task = require("../models/Task");
const User = require("../models/User");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, priority, completed, date, time } = req.body;

    // Get the logged-in user from the token
    const userId = req.user.id; // Assuming user is authenticated and user ID is available in req.user

    // Create a new task for the user
    const newTask = new Task({
      title,
      priority,
      date,
      time,
      user: userId, // Assign the task to the user
    });

    await newTask.save();

    res.status(201).json({ status: true, message: "Task created successfully", task: newTask });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Get all tasks for the user
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID
    const tasks = await Task.find({ user: userId }); // Find tasks belonging to the logged-in user
    res.status(201).json({status: true, tasks});
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Get a specific task by ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    res.status(201).json({status: true, task});
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title, priority, completed, date, time } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, priority, completed, date, time },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ status: fasle, message: "Task not found" });
    }

    res.status(201).json({ status: true, message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({status: false, message: "Task not found" });
    }

    res.status(201).json({ status: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({status: false, error: err.message });
  }
};
