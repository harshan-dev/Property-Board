# Property Board Application

A full-stack property listing application built with Next.js, Node.js, and PostgreSQL.

## Features

- View all properties with details (title, price, location, description, image)
- Add new properties through a responsive form
- Real-time validation and error handling
- Responsive design that works on desktop and mobile
- RESTful API with proper error handling

## Tech Stack

### Frontend

- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API calls
- Responsive design with mobile-first approach

### Backend

- **Node.js** with Express
- **PostgreSQL** database
- **CORS** enabled for cross-origin requests
- Input validation and error handling

### Database

- **PostgreSQL** with proper schema design
- Auto-incrementing IDs and timestamps
- Sample seed data included

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup Instructions

### 1. Database Setup

1. Install and start PostgreSQL
2. Create the database by running the SQL script:
   ```bash
   psql -U postgres -f db/init.sql
   ```
3. Update the database credentials in `backend/.env`

### 2. Backend Setup

```bash
cd backend
npm install
# Update .env file with your database credentials
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### GET /api/properties

Returns all properties in the database.

**Response:**

```json
[
  {
    "id": 1,
    "title": "Modern Downtown Apartment",
    "price": 450000,
    "location": "New York, NY",
    "description": "Beautiful 2-bedroom apartment...",
    "image": "https://...",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

### POST /api/properties

Adds a new property to the database.

**Request Body:**

```json
{
  "title": "Property Title",
  "price": 350000,
  "location": "City, State",
  "description": "Optional description",
  "image": "Optional image URL"
}
```

**Response:**

```json
{
  "id": 3,
  "title": "Property Title",
  "price": 350000,
  "location": "City, State",
  "description": "Optional description",
  "image": "Optional image URL",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

## Environment Variables

### Backend (.env)

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=property_board
```

## Project Structure

```
property-board/
├── backend/
│   ├── routes/
│   │   └── properties.js
│   ├── .env
│   ├── db.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── add-property/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── PropertyCard.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── property.ts
│   └── package.json
└── db/
    └── init.sql
```

## Development Notes

- The application includes proper form validation on both frontend and backend
- Error handling is implemented throughout the application
- The design is fully responsive and works on all screen sizes
- Images use placeholder fallbacks if URLs are invalid
- CORS is properly configured for local development

## Future Enhancements

- User authentication and authorization
- Property images upload functionality
- Search and filter capabilities
- Property details page
- Edit and delete property functionality
- Pagination for large property lists
