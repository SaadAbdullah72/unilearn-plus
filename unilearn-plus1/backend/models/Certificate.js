const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseName: String,
  
  // UNIQUE CERTIFICATE ID (Verification ke liye)
  certificateId: { type: String, required: true, unique: true }, 
  
  issueDate: { type: Date, default: Date.now },
  verificationUrl: String
});

module.exports = mongoose.model('Certificate', certificateSchema);