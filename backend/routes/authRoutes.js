const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Generate JWT Token
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Middleware to verify JWT token in cookies
const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Add user ID to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// **REGISTER**
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// **LOGIN**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT token and store it in a cookie
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true, // Can't be accessed by JavaScript
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 3600000, // 1 hour
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// **CHECK SESSION** - To check if user is logged in
router.get("/session", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); // Get user info excluding password
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch user data" });
  }
});

// **LOGOUT**
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the JWT token cookie
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
