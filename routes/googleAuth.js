const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Google login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Generate JWT token for user
    const token = jwt.sign(
      { id: req.user.id }, // Use user ID as the payload
      process.env.JWT_SECRET, // JWT secret key
      { expiresIn: "1d" } // Token expiry
    );

    // Send token as response
    res.json({ token });
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
