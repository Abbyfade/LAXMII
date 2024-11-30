require("dotenv").config();
require("./config/passport");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const googleAuthRoutes = require("./routes/googleAuth");
const taskRoutes= require("./routes/taskUrls");


const app = express();
app.use(express.json());

connectDB();

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/tasks", taskRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




