const express = require('express');
const route = express.Router();
const controller = require('../Controller/user.controller');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const postController = require('../Controller/postController')

// Configure Cloudinary with your API credentials
cloudinary.config({
  cloud_name: 'dg0kdnwt1',
  api_key: '743174149656362',
  api_secret: 'NT0lp3G44g26b2jYH8BX5Ju0UsY',
});


// Set up multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'uploads', // Folder in your Cloudinary account where the files will be stored
  allowedFormats: ['jpg', 'png', 'jpeg', 'svg'], // Allowed file formats
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix); // Set the filename for the uploaded file
  },
});

const upload = multer({ storage });

route.get('/', (req, res) => {
  res.json('hello');
});

route.post('/register', controller.registerUser);
route.post('/login', controller.loginUser);
route.post('/create', upload.single('content'), postController.createPost);

module.exports = route;
