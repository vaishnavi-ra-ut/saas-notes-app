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

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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

module.exports = router;
