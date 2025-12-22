const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');

// ==========================================
// 1. GET ALL ENROLLMENTS - SIMPLE WORKING VERSION
// ==========================================
router.get('/', async (req, res) => {
  console.log("📞 API Called: /api/enrollments", req.query);
  
  try {
    const { studentId } = req.query;
    
    if (!studentId) {
      console.log("❌ Missing studentId");
      return res.status(400).json({ 
        success: false, 
        error: "Student ID is required" 
      });
    }

    console.log(`🔍 Fetching enrollments for student: ${studentId}`);
    
    // SIMPLE FIX: NO POPULATE AT ALL
    const enrollments = await Enrollment.find({ studentId })
      .sort({ enrolledAt: -1 });

    console.log(`✅ Found ${enrollments.length} enrollments`);
    
    // Return plain data without populate
    res.json({ 
      success: true, 
      count: enrollments.length,
      data: enrollments 
    });

  } catch (err) {
    console.error("❌ SERVER ERROR DETAILS:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    res.status(500).json({ 
      success: false, 
      error: "Server error. Check backend logs.",
      details: err.message 
    });
  }
});

module.exports = router;