-- property_board_v1 database

CREATE DATABASE property_board_v1;

-- connect to the property_board database and create the table
\c property_board_v1;

CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- insert sample data
INSERT INTO properties (title, price, location, description, image) VALUES
('Modern Downtown Apartment', 450000, 'New York, NY', 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500'),
('Cozy Suburban House', 320000, 'Austin, TX', 'Charming 3-bedroom house with a large backyard, perfect for families.', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500');
