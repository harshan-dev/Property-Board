const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'property-board',
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 1024, height: 768, crop: 'limit' }]
  },
});

module.exports = {
  cloudinary,
  storage,
};
