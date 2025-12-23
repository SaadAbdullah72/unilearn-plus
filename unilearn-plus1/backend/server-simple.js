const express = require('express');
const app = express();
const PORT = 5000;

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Test Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/courses', (req, res) => {
  res.json([
    { id: 1, title: 'JavaScript Course', price: 100 },
    { id: 2, title: 'React Course', price: 150 }
  ]);
});

app.get('/', (req, res) => {
  res.send('UniLearn+ Backend Server');
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Test: http://localhost:${PORT}/api/health`);
  console.log(`📚 Courses: http://localhost:${PORT}/api/courses`);
});