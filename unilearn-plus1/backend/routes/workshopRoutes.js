const express = require('express');
const router = express.Router();
const multer = require('multer');
const Workshop = require('../models/Workshop'); // Ensure model exists

// 👇 1. CLOUDINARY SETUP (Same as Course)
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dlbc7qwqm', 
  api_key: '916513182442267',
  api_secret: 'bzhITBivzZV4q0os_oOmqRowCDk'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'unilearn_workshops', // Alag folder banaya
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// ==========================================
// 1. GET ALL WORKSHOPS
// ==========================================
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ date: 1 }); // Date wise sort
    res.json({ data: workshops });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADD NEW WORKSHOP
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log("🚀 Workshop Upload Started...");
    console.log("Data:", req.body); // Terminal mein data check karne ke liye

    const { title, description, date, time, venue, price, instructorName, instructorId } = req.body;
    
    let imageUrl = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070'; // Default Image
    if (req.file) {
        imageUrl = req.file.path; // Cloudinary URL
    }

    const newWorkshop = new Workshop({
      title,
      description,
      date,
      time,
      venue,
      price: Number(price), // Ensure Number format
      instructor: instructorName,
      instructorId,
      image: imageUrl,
      status: 'upcoming'
    });

    await newWorkshop.save();
    console.log("✅ Workshop Saved:", title);
    
    res.status(201).json({ message: "Workshop Created Successfully!", data: newWorkshop });

  } catch (err) {
    console.error("❌ Workshop Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;