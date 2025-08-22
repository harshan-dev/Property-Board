const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const DB_STRICT = (process.env.DB_STRICT || 'true').toLowerCase() === 'true';


const pool = require('../db');

const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Sanitize and unique filename
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${path.basename(sanitized, path.extname(sanitized))}-${uniqueSuffix}${path.extname(sanitized)}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET /api/properties - get all properties
router.get('/', async (req, res) => {
  try {
    //console.log('GET /api/properties - Fetching properties from db');
    
    const result = await pool.query('SELECT id, title, price::float AS price, location, description, image, created_at FROM properties ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    //console.error('DB error:', err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// GET /api/properties/db-health - Quick db connectivity check
router.get('/db-health', async (req, res) => {
  try {
    const r = await pool.query('SELECT 1 as ok');
    res.json({ ok: true, result: r.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/properties - add new property
router.post('/', upload.single('image'), async (req, res) => {
  try {
    //console.log('POST /api/properties - adding new property');
    const { title, price, location, description } = req.body;

    // validation
    if (!title || !price || !location) {
      return res.status(400).json({ error: 'Title, price, and location are required' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    let imagePath = null;
    if (req.file) {
      // save relative path to db "/uploads/filename"
      imagePath = `/uploads/${req.file.filename}`;
      //console.log('img uploaded:', req.file.path);
      //console.log('saved image path for db:', imagePath);
    }

    // Try to save to db
    try {
      const insertQuery = `
        INSERT INTO properties (title, price, location, description, image)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [title, parseFloat(price), location, description, imagePath];
      
      const result = await pool.query(insertQuery, values);
      
      //console.log('saved success');
      const row = result.rows[0];
      // price is a number
      if (row && typeof row.price === 'string') row.price = parseFloat(row.price);
      res.status(201).json(row);
    } catch (dbError) {
      // if db insert fails, remove uploaded file
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupErr) {
          //console.error('failed to clean up file:', cleanupErr.message);
        }
      }
      res.status(500).json({ error: 'Database insert failed' });
    }
  } catch (err) {
    //console.error('error adding property:', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

module.exports = router;
