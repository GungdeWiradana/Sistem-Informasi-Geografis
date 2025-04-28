// Import library
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Init express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect database
require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const markerRoutes = require('./routes/markerRoutes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/markers', markerRoutes);

// Serve static frontend (React build)
// Asumsinya /public ada di luar folder backend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback semua route selain /api ke index.html React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 11148;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
