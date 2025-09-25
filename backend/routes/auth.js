const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // make sure path is correct

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { 
        id: newUser._id,
        userId: newUser._id,
        tenant: newUser.tenant,
        role: newUser.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(201).json({
  token,
  user: {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    tenant: newUser.tenant,
    role: newUser.role
  },
});

  } catch (err) {
    console.error("Signup error:", err);  // <-- Add this line to see the exact error
    res.status(500).json({ msg: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        userId: user._id,
        tenant: user.tenant,
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tenant: user.tenant,
        role: user.role
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
