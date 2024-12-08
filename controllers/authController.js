const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Configure email transport (use your own credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Signup Function
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ status:false, message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Create new user with `verified` set to false and save OTP and expiry
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    });
    await newUser.save();

    // Send OTP to email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ status: true, message: "User created! Please verify your email with the OTP." });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Verify OTP Function
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false, message: "User not found" });

    // Check if OTP matches and is not expired
    if (user.otp !== otp) return res.status(400).json({ status: false, message: "Invalid OTP" });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ status: false, message: "OTP expired" });

    // Verify user and clear OTP fields
    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ status: true, message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Login Function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    const name = user.name;
    if (!user) return res.status(400).json({ status: false, message: "Invalid credentials" });

    // Check if email is verified
    if (!user.verified) return res.status(400).json({ status: false, message: "Please verify your email first" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ status: true, name, email, token });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Resend OTP Function
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false, message: "User not found" });

    // Generate a new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 *1000; // Valid for 10 minutes
    await user.save();

    // Send OTP to email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend OTP",
      text: `Your new OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ status: true, message: "New OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Forgot Password Function
exports.forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ status: false, message: "User not found" });

      // Generate a new OTP for password reset
      const resetOtp = generateOTP();
      user.otp = resetOtp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes
      await user.save();

      // Send OTP to email
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Reset Your Password",
          text: `Your OTP for resetting your password is: ${resetOtp}. It is valid for 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ status: true, message: "OTP sent to your email." });
  } catch (err) {
      res.status(500).json({ status:false, error: err.message });
  }
};

// Verify Reset OTP Function
exports.resetPassword = async (req, res) => {
  try {
      const { email, newPassword } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ status: false, message: "User not found" });


      // Hash the new password and save it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      user.password = hashedPassword;

      await user.save();

      res.status(200).json({ status: true, message: "Password has been reset successfully!" });
  } catch (err) {
      res.status(500).json({ status: false, error: err.message });
  }
};
