const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["week", "month", "year"],  
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
  // time: {
  //   type: String,  
  //   required: true,
  // },
});

module.exports = mongoose.model("Task", taskSchema);
