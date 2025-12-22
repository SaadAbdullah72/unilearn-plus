const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 👇 YEH FIELD MISSING THI, ISLIYE ERROR AA RAHA THA
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', // Link to Course Model
    default: null
  },

  // Workshops ke liye
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workshop', // Link to Workshop Model (Agar model nahi hai to bhi error nahi dega)
    default: null
  },

  itemType: { 
    type: String, 
    required: true, 
    enum: ['course', 'workshop'] 
  },

  title: { type: String, required: true },
  image: { type: String },
  price: { type: Number },
  
  // Workshop specific fields
  eventDate: { type: String },
  eventTime: { type: String },
  eventVenue: { type: String },

  status: { type: String, default: 'active' },
  enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);