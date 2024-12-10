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
    if (!user) return res.status(400).json({ status: false, message: "Invalid credentials" });

    // Check if email is verified
    if (!user.verified) return res.status(400).json({ status: false, message: "Please verify your email first" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, message: "Invalid credentials" });

    // Get user name
    const name = user.name;

    // Generate JWT
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ status: true, name, email, accessToken, refreshToken });
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

exports.refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ status: false, message: "Refresh token required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Optionally verify refresh token from the database
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ status: false, message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.status(200).json({ status: true, accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ status: false, message: "Invalid or expired refresh token" });
  }
};


// Logout endpoint (for JWT)
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
  
    // Optionally remove the refresh token from the database
    const user = await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    if (!user) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    res.status(200).json({ status: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error logging out" });
  }
};
