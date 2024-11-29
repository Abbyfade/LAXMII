const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  otp: { type: String }, // Store OTP
  otpExpiry: { type: Date }, // Store OTP expiration time
});

module.exports = mongoose.model("User", userSchema);
