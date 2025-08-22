const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    //console.log('tables created success');
  } catch (err) {
    console.error('error creating tables:', err.message);
  }
};

const seedData = async () => {
  try {
    const checkQuery = 'SELECT COUNT(*) FROM properties';
    const result = await pool.query(checkQuery);
    
    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO properties (title, price, location, description, image) VALUES
        ('Modern Downtown Apartment', 450000, 'New York, NY', 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500'),
        ('Cozy Suburban House', 320000, 'Austin, TX', 'Charming 3-bedroom house with a large backyard, perfect for families.', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500')
      `);
      //console.log('seed data inserted success');
    }
  } catch (err) {
    console.error('error seeding data:', err.message);
  }
};

// Initialize database tables and seed data
createTables().then(() => seedData()).catch(err => {
  console.error('db initialization failed:', err.message);
});

module.exports = pool;