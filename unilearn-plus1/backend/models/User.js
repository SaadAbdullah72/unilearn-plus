const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Role: student (khareedne wala), instructor (bechne wala), admin (approve karne wala)
  role: { 
    type: String, 
    default: 'student', 
    enum: ['student', 'instructor', 'admin'] 
  },
  // Wallet: Paise yahan jama honge
  walletBalance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);