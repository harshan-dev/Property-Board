const express = require('express');
const multer = require('multer');
const router = express.Router();
const pool = require('../db');
const { cloudinary, storage } = require('../config/cloudinary');

// Configure multer to use Cloudinary storage
const upload = multer({ storage });

// GET /api/properties - get all properties
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/properties - Fetching properties from database');
    const result = await pool.query('SELECT id, title, price::float AS price, location, description, image, created_at FROM properties ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err.message);
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
    console.log('POST /api/properties - adding new property');
    const { title, price, location, description } = req.body;

    // Validation
    if (!title || !price || !location) {
      // If validation fails and an image was uploaded, delete it from Cloudinary
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({ error: 'Title, price, and location are required' });
    }

    if (isNaN(price) || price <= 0) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const imageUrl = req.file ? req.file.path : null;

    // Save to database
    try {
      const insertQuery = `
        INSERT INTO properties (title, price, location, description, image)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [title, parseFloat(price), location, description, imageUrl];
      
      const result = await pool.query(insertQuery, values);
      
      console.log('Property saved successfully');
      const row = result.rows[0];
      if (row && typeof row.price === 'string') row.price = parseFloat(row.price);
      res.status(201).json(row);
    } catch (dbError) {
      console.error('Database insert failed:', dbError);
      // If DB insert fails, delete the uploaded image from Cloudinary
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      res.status(500).json({ error: 'Database insert failed' });
    }
  } catch (err) {
    console.error('Error adding property:', err);
    // Handle potential upload errors that are not caught by the DB block
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
