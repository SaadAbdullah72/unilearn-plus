const express = require('express');
const router = express.Router();
const multer = require('multer');
const Course = require('../models/Course'); 

// 👇 1. CLOUDINARY IMPORTS
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 👇 2. CLOUDINARY CONFIGURATION (Tumhari Keys)
cloudinary.config({
  cloud_name: 'dlbc7qwqm', 
  api_key: '916513182442267',
  api_secret: 'bzhITBivzZV4q0os_oOmqRowCDk'
});

// 👇 3. STORAGE ENGINE (Cloudinary)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'unilearn_courses', // Cloudinary Folder Name
    resource_type: 'auto',      // Auto detect (Image/Video)
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mkv'],
  },
});

const upload = multer({ storage: storage });

// ==================================================================
// 🚨 ROUTE ORDER IS CRITICAL (DO NOT CHANGE) 🚨
// ==================================================================

// 1. ADMIN: FETCH ALL COURSES (Pending + Approved)
router.get('/admin/all', async (req, res) => {
    try {
      // Sab courses bhejo (Pending ho ya Approved)
      const courses = await Course.find().sort({ createdAt: -1 });
      
      console.log(`👨‍💻 ADMIN FETCH: Sent ${courses.length} courses to Admin Dashboard`);
      res.json({ data: courses });
    } catch (err) {
      console.error("Admin Fetch Error:", err);
      res.status(500).json({ error: err.message });
    }
});

// 2. PUBLIC: FETCH APPROVED ONLY (Home Page)
router.get('/', async (req, res) => {
  try {
    // Sirf 'approved' wale dikhao Home page par
    const courses = await Course.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json({ data: courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. UPLOAD COURSE (Cloudinary Version)
router.post('/', upload.any(), async (req, res) => {
  try {
    console.log("🚀 Upload Process Started...");
    const { title, description, price, category, instructorId, instructorName } = req.body;
    
    // Modules JSON string se wapis Object banao
    let modules = req.body.modules ? JSON.parse(req.body.modules) : [];
    
    // 👇 IMAGE HANDLING (Cloudinary URL uthao)
    let courseImage = '';
    const imageFile = req.files.find(f => f.fieldname === 'image');
    if (imageFile) {
        console.log("✅ Image Uploaded to Cloudinary:", imageFile.path);
        courseImage = imageFile.path; // Cloudinary URL
    }

    // 👇 VIDEO HANDLING (Cloudinary URL uthao)
    req.files.forEach(file => {
        if (file.fieldname.startsWith('video_')) {
            const parts = file.fieldname.split('_');
            const mIdx = parseInt(parts[1]); 
            const lIdx = parseInt(parts[2]);
            
            if (modules[mIdx]?.lessons[lIdx]) {
                console.log(`✅ Video Uploaded for Module ${mIdx} Lesson ${lIdx}:`, file.path);
                
                // Cloudinary URL save karo
                modules[mIdx].lessons[lIdx].videoUrl = file.path;
                modules[mIdx].lessons[lIdx].duration = 15; // Default time
            }
        }
    });

    const newCourse = new Course({
      title, 
      description, 
      price, 
      category, 
      instructor: instructorName, 
      instructorId,
      image: courseImage, 
      modules, 
      status: 'pending', // Default Pending rahega taake Admin approve kare
      totalDuration: 0
    });

    await newCourse.save();
    console.log("🎉 Course Saved to Database with ID:", newCourse._id);
    res.status(201).json({ message: "Course Uploaded Successfully!", data: newCourse });

  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. APPROVE COURSE (Admin Action)
router.put('/:id/approve', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id, 
            { status: 'approved' }, 
            { new: true }
        );
        
        if (!course) return res.status(404).json({ message: "Course not found" });

        console.log(`✅ Course Approved: ${course.title}`);
        res.json({ message: "Course Approved Live!", data: course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. GET SINGLE COURSE (Yeh End mein rakhna zaroori hai)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course Not Found" });
    res.json({ data: course });
  } catch (err) {
    res.status(500).json({ error: "Invalid ID Format" });
  }
});

// 6. DELETE COURSE
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;