const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Debug endpoint to list files in the uploads folder (temporary)
app.get('/debug/uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({ files: [], message: 'uploads directory does not exist on this instance' });
    }
    const files = fs.readdirSync(uploadsDir);
    return res.status(200).json({ files });
  } catch (err) {
    console.error('Error reading uploads directory:', err);
    return res.status(500).json({ error: err.message });
  }
});

// routes
app.use('/api/properties', require('./routes/properties'));

// health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Property Board API is running!' });
});

const PORT = process.env.PORT || 5000;

// Add error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/properties`);
});
