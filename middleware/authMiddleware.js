const jwt = require("jsonwebtoken");
const User = require("../models/User");



const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
  
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
  
    // Remove "Bearer " from the token string
    const tokenString = token.split(" ")[1]; 
  
    if (!tokenString) {
      return res.status(401).json({ message: "Token format is incorrect" });
    }
  
  
    try {
      const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
      req.user = decoded; 
      next();
    } catch (err) {
      // console.error("Token verification error:", err); 
      res.status(401).json({ message: "Invalid token" });
    }
  };
  
  module.exports = authMiddleware;