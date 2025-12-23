require('dotenv').config(); // SABSE UPAR (Line 1)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Images/Videos ke liye Uploads Folder Public karo
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MONGODB CONNECTION ---
// Note: Apni connection string yahan check kar lena
const connectionString = 'mongodb+srv://saad489254_db_user:v2sbdVNjdrfQ6yHl@cluster0.uvtqxwb.mongodb.net/unilearn_plus?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connectionString)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Error:', err.message));

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes'); // <--- YEH MISSING THA SHAYAD

// --- USE ROUTES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes); // <--- CHATBOT ROUTE ACTIVE

app.use(cors({
  origin: 'http://localhost:3000', // React frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Default Route
app.get('/', (req, res) => {
    res.send('UniLearn+ Server Systems Online 🟢');
});

// Server Start
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});