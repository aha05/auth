require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://172.21.128.1:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/ `))
  )
  .catch((err) => console.error(err));

