require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// ✅ FIX 1: CORS origin se slash hatana aur localhost bhi add karna (Testing ke liye)
const allowedOrigins = [
  'https://unilearn-plus.vercel.app',
  'https://unilearn-plus.edgeone.dev',
  'http://localhost:5173' // Aapka local frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());

// ✅ FIX 2: Static files (Vercel par uploads folder nahi chalta, but code crash na ho isliye path theek kiya)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// connectionString ke bajaye seedha process.env use karo
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("❌ CRITICAL ERROR: MONGO_URI is missing in Environment Variables!");
}

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ FIX 3: Routes ke require ko path.join ke saath likhna zyada safe hai
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/workshops', require('./routes/workshopRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'UniLearn+ Backend Online 🟢' });
});

app.get('/', (req, res) => {
  res.json({ status: 'UniLearn+ Backend Root Online 🟢' });
});

module.exports = app;