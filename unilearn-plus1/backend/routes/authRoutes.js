const express = require('express');
const router = express.Router();
const User = require('../models/User');

// SIGNUP ROUTE
router.post('/register', async (req, res) => {
  try {
    console.log("📨 SIGNUP REQUEST BODY:", req.body);
    
    const { name, email, password, role } = req.body;
    
    // 1. Check if all fields exist
    if (!name || !email || !password || !role) {
      console.log("❌ MISSING FIELDS:", { name, email, role, password: password ? "***" : "MISSING" });
      return res.status(400).json({ 
        message: "All fields are required",
        missing: { name: !name, email: !email, password: !password, role: !role }
      });
    }
    
    console.log("✅ All fields present, creating user...");
    
    // 2. Create user
    const user = new User({ name, email, password, role });
    await user.save();
    
    console.log("✅ User saved successfully:", user._id);
    res.status(201).json({ 
      message: "User Registered Successfully", 
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
    
  } catch (error) {
    console.error("❌ REGISTRATION ERROR:", error.message);
    console.error("❌ ERROR DETAILS:", error);
    
    res.status(400).json({ 
      message: "Error Registering User", 
      error: error.message,
      field: error.errors ? Object.keys(error.errors)[0] : 'unknown'
    });
  }
});

// LOGIN ROUTE (Simple Version - No Token)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sirf User ka data wapis bhejo (Token nahi)
    res.json({ 
        message: "Login Successful", 
        data: user 
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;