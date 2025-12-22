const mongoose = require('mongoose');
const Course = require('./models/Course');
const Workshop = require('./models/Workshop');
const User = require('./models/User');

// Connection String
const connectionString = 'mongodb+srv://saad489254_db_user:v2sbdVNjdrfQ6yHl@cluster0.uvtqxwb.mongodb.net/unilearn_plus?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connectionString)
  .then(() => seedData())
  .catch(err => console.log(err));

const seedData = async () => {
  console.log("🌱 Seeding Database...");

  // 1. Clear Old Data
  try {
      await Course.deleteMany({});
      await Workshop.deleteMany({});
  } catch (e) {
      console.log("Clearing old data...");
  }

  // 2. Dummy Instructor Info
  const instructor = await User.findOne({ role: 'instructor' });
  // Agar instructor nahi mila to aik fake ID bana lo (Warning: Real app mein user hona chahiye)
  const instructorId = instructor ? instructor._id : new mongoose.Types.ObjectId();
  const instructorName = instructor ? instructor.name : "Saad Abdullah";

  // Fake Video URL (Sample video jo play bhi hogi)
  const sampleVideo = "https://www.w3schools.com/html/mov_bbb.mp4"; 

  // 3. Create Courses (Ab Video URL ke sath)
  const courses = [
    { 
        title: "Complete Python Bootcamp", 
        description: "Learn Python from scratch to advanced. Master Python 3 by building 100 projects in 100 days.", 
        price: 5000, 
        videoUrl: sampleVideo, // FIX HERE
        instructor: instructorName, 
        instructorId: instructorId, 
        isApproved: true 
    },
    { 
        title: "React JS Masterclass", 
        description: "Build modern web apps with React & Redux. The complete guide for frontend developers.", 
        price: 8000, 
        videoUrl: sampleVideo, 
        instructor: instructorName, 
        instructorId: instructorId, 
        isApproved: true 
    },
    { 
        title: "Data Science with AI", 
        description: "Machine Learning models and data analysis using Pandas, NumPy and Scikit-Learn.", 
        price: 12000, 
        videoUrl: sampleVideo, 
        instructor: instructorName, 
        instructorId: instructorId, 
        isApproved: true 
    },
    { 
        title: "Digital Marketing Pro", 
        description: "SEO, SMM and Google Ads mastery. Learn to grow any business online.", 
        price: 3000, 
        videoUrl: sampleVideo, 
        instructor: instructorName, 
        instructorId: instructorId, 
        isApproved: true 
    },
    { 
        title: "Flutter App Development", 
        description: "Build iOS and Android apps with one codebase using Dart and Flutter.", 
        price: 9000, 
        videoUrl: sampleVideo, 
        instructor: instructorName, 
        instructorId: instructorId, 
        isApproved: true 
    },
    { 
        title: "Blockchain & Web3", 
        description: "Smart contracts and DApps on Ethereum. Solidity programming from scratch.", 
        price: 15000, 
        videoUrl: sampleVideo, 
        instructor: instructorName, 
        instructorId: instructorId, 
        isApproved: true 
    },
    { 
        title: "Graphic Design Basics", 
        description: "Photoshop and Illustrator for beginners. Design Logos, Banners and UI.", 
        price: 4000, 
        videoUrl: sampleVideo, 
        instructor: instructorName, 
        instructorId: instructorId, 
        isApproved: true 
    },
    { 
        title: "Cyber Security Ethical Hacking", 
        description: "Penetration testing and network security. Protect systems from attacks.", 
        price: 11000, 
        videoUrl: sampleVideo, 
        instructor: instructorName, 
        instructorId: instructorId, 
        isApproved: true 
    },
  ];

  // 4. Create Workshops
  const workshops = [
    { title: "AI in Healthcare Summit", description: "Future of medicine with AI.", date: "12th Jan, 2026", time: "10:00 AM", venue: "Main Auditorium", instructor: "Dr. Alvi", price: 500 },
    { title: "Robotics Hands-on Workshop", description: "Build your first robot.", date: "15th Jan, 2026", time: "02:00 PM", venue: "Lab 3", instructor: "Engr. Taha", price: 1000 },
    { title: "Freelancing Bootcamp", description: "How to earn on Upwork/Fiverr.", date: "20th Jan, 2026", time: "05:00 PM", venue: "Online (Zoom)", instructor: "Saad Abdullah", price: 0 },
    { title: "Game Dev with Unity", description: "3D Game development basics.", date: "25th Jan, 2026", time: "11:00 AM", venue: "CS Lab 1", instructor: "GameDev Hub", price: 2000 },
    { title: "Cloud Computing AWS", description: "Deploy apps on the cloud.", date: "28th Jan, 2026", time: "09:00 AM", venue: "Seminar Hall", instructor: "AWS Expert", price: 1500 },
    { title: "Startup Pitch Night", description: "Pitch your ideas to investors.", date: "5th Feb, 2026", time: "06:00 PM", venue: "Incubation Center", instructor: "Team UniLearn", price: 0 },
    { title: "Photography Walk", description: "Learn outdoor photography.", date: "10th Feb, 2026", time: "07:00 AM", venue: "F-9 Park", instructor: "Lens Art", price: 500 },
    { title: "CV Writing & Interview Prep", description: "Land your dream job.", date: "14th Feb, 2026", time: "03:00 PM", venue: "Career Office", instructor: "HR Dept", price: 0 },
  ];

  try {
      await Course.insertMany(courses);
      await Workshop.insertMany(workshops);
      console.log("✅ Database Seeded Successfully with 8 Courses & 8 Workshops!");
  } catch (err) {
      console.log("❌ Seeding Error:", err.message);
  }
  
  process.exit();
};