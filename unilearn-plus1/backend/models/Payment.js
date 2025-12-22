const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String },
  itemId: { type: String, required: true }, // Course/Workshop ID
  itemTitle: { type: String, required: true },
  
  // --- YEH LINE ZAROORI HAI ---
  itemType: { type: String, enum: ['course', 'workshop'], required: true }, 
  
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);