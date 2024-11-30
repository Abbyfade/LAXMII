const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["High", "Low"],  
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,  // Default value is false
  },
  date: {
    type: Date,
    default: Date.now,  // Default to the current date
  },
  time: {
    type: String,  
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
