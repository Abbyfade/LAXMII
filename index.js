require("dotenv").config();
require("./config/passport");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const googleAuthRoutes = require("./routes/googleAuth");
const taskRoutes= require("./routes/taskUrls");
const invoiceRoutes = require("./routes/invoiceUrls");
const inventoryRoutes = require("./routes/inventoryUrls");
const salesRoutes = require("./routes/salesUrls");
const cron = require('./utils/invoiceCron');

const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:your_flutter_port', // Replace with your Flutter app's localhost URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// app.use(cors(corsOptions));
app.use(cors());



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
app.use("/api/tasks", taskRoutes); 
app.use("/api/invoices", invoiceRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", salesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




