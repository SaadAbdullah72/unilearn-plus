const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Instructor Details
  instructor: { type: String, required: true },   // Name
  instructorId: { type: String, required: true }, // ID (Zaroori hai)

  // Event Details
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  price: { type: Number, default: 0 },

  // 👇 YEH MISSING THAY
  image: { type: String }, // Cloudinary Link
  status: { type: String, default: 'upcoming' } // upcoming / live / ended

}, { timestamps: true });

module.exports = mongoose.model('Workshop', WorkshopSchema);