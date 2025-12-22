const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Workshop = require('../models/Workshop');

// 1. SUBMIT PAYMENT (Updated to accept itemType)
router.post('/easypaisa', async (req, res) => {
  try {
    // Frontend se itemType aana zaroori hai
    const newPayment = new Payment(req.body); 
    await newPayment.save();
    res.status(201).json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET ALL PAYMENTS
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ data: payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. APPROVE & ENROLL (CRITICAL FIX)
router.put('/approve/:id', async (req, res) => {
  try {
    // A. Payment Status Update
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });

    // B. Check karo Course hai ya Workshop
    let details;
    if (payment.itemType === 'course') {
        details = await Course.findById(payment.itemId);
    } else {
        details = await Workshop.findById(payment.itemId);
    }

    if (!details) return res.status(404).json({ message: "Item not found" });

    // C. Check Existing Enrollment
    const existing = await Enrollment.findOne({ studentId: payment.studentId, itemId: payment.itemId });
    if (!existing) {
        // D. Create Enrollment
        await Enrollment.create({
            studentId: payment.studentId,
            itemId: payment.itemId,
            itemType: payment.itemType, // course or workshop
            title: details.title,
            image: details.videoUrl || "", // Course ke liye
            eventDate: details.date || "", // Workshop ke liye
            eventTime: details.time || "",
            eventVenue: details.venue || ""
        });
    }

    res.json({ message: "Approved & Enrolled" });
  } catch (err) {
    console.error("Approval Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;