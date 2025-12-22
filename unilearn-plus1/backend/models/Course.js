const mongoose = require('mongoose');

// --- SUB-SCHEMAS ---

const lessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String, 
  duration: Number, 
  isFree: { type: Boolean, default: false } 
});

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number 
});

const moduleSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema], 
  quiz: [quizSchema]       
});

// --- MAIN COURSE SCHEMA ---

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  category: { type: String, default: 'General' }, 
  instructor: String,
  instructorId: String,
  image: String, 
  
  modules: [moduleSchema], 
  
  totalDuration: { type: Number, default: 0 }, 
  
  // 👇 YEH HAI WO LINE JISKI WAJAH SE ERROR AA RAHA THA
  status: { 
    type: String, 
    // Ab yeh 'pending' aur 'approved' dono ko accept karega
    enum: ['pending', 'approved', 'rejected', 'Pending', 'Approved'], 
    default: 'pending' 
  },

  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);