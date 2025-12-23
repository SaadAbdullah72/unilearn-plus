require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://unilearn-plus-47oz9dlt57.edgeone.dev/', // ya tumhare frontend domain, EdgeOne
  credentials: true
}));
app.use(bodyParser.json());

// Images/Videos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB
const connectionString = process.env.MONGO_URI || 'mongodb+srv://saad489254_db_user:xxxx@cluster0.uvtqxwb.mongodb.net/unilearn_plus?retryWrites=true&w=majority';
mongoose.connect(connectionString)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Error:', err.message));

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/workshops', require('./routes/workshopRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Default route
app.get('/', (req, res) => {
  res.json({ status: 'UniLearn+ Backend Online 🟢' });
});

// ❌ Remove app.listen() for Vercel
module.exports = app; // <-- Important: Export app
