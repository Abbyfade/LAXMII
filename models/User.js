const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  verified: { type: Boolean, default: false },
  otp: { type: String }, // Store OTP
  otpExpiry: { type: Date }, // Store OTP expiration time
  googleId: { type: String }, // Store Google user ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
